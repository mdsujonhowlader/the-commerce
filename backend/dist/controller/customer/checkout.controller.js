import crypto from "node:crypto";
import { getDbUserFromReq } from "../../middleware/auth.js";
import { Cart } from "../../models/Cart.js";
import { Order } from "../../models/Order.js";
import { Product } from "../../models/Product.js";
import { Promo } from "../../models/Promo.js";
import { User } from "../../models/User.js";
import { AppError } from "../../utils/AppError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/envelope.js";
import { requireFound, requireText } from "../../utils/helper.js";
import { initPayment, validatePayment } from "../../utils/sslcommerz.js";
const FRONTEND_URL = process.env.CORS_ORIGINS?.split(",")[0]?.trim() || "http://localhost:5173";
export const checkoutSession = asyncHandler(async (req, res) => {
    const dbUser = await getDbUserFromReq(req);
    const addressId = String(req.body.addressId).trim();
    const promocode = String(req.body.promoCode || "")
        .trim()
        .toUpperCase();
    requireText(addressId, "Address is required");
    const [user, cart] = await Promise.all([
        User.findById(dbUser._id)
            .select("name email addresses")
            .lean(),
        Cart.findOne({ user: dbUser._id }).select("items").lean(),
    ]);
    const foundUser = requireFound(user, "user not found", 404);
    const foundCart = requireFound(cart, "cart not found", 404);
    if (!foundCart.items.length) {
        throw new AppError(400, "Cart is empty");
    }
    const selectAddress = foundUser.addresses.find((item) => String(item._id) === addressId);
    if (!selectAddress) {
        throw new AppError(400, "Address is not found");
    }
    const products = await Product.find({
        _id: { $in: foundCart.items.map((item) => item.product) },
    })
        .select("price salePercentage stock status")
        .lean();
    const productMap = new Map(products.map((item) => [String(item._id), item]));
    let totalItems = 0;
    let subTotal = 0;
    const items = foundCart.items.map((cartItem) => {
        const product = productMap.get(String(cartItem.product));
        if (!product || product.status !== "active") {
            throw new AppError(400, "One or more cart items are not avaibale");
        }
        if (product.stock < cartItem.quantity) {
            throw new AppError(400, "Cart items are out of stock");
        }
        const finalPrice = product.salePercentage
            ? Math.round(product.price - (product.price * product.salePercentage) / 100)
            : product.price;
        totalItems += cartItem.quantity;
        subTotal += finalPrice * cartItem.quantity;
        return {
            products: cartItem.product,
            quantity: cartItem.quantity,
        };
    });
    let appliedPromoCode = "";
    let discountAmmount = 0;
    if (promocode) {
        const promo = await Promo.findOne({ code: promocode })
            .select("code percentage count minimumOrderValue startAt endsAt")
            .lean();
        const foundPromo = requireFound(promo, "promo not found", 404);
        const now = new Date();
        if (now < foundPromo.startAt ||
            now > foundPromo.endsAt ||
            foundPromo.count < 1) {
            throw new AppError(400, "Promo is not activate");
        }
        if (subTotal < foundPromo.minimumOrderValue) {
            throw new AppError(400, "Minimum order value for this promo is not at the threesold");
        }
        appliedPromoCode = foundPromo.code;
        discountAmmount = Math.round((subTotal * foundPromo.percentage) / 100);
    }
    const totalAmount = Math.max(subTotal - discountAmmount, 0);
    const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
    const deliveryName = selectAddress.fullName;
    const deliveryAddress = selectAddress.address;
    const cus_city = selectAddress.state;
    const cus_postcode = selectAddress.postalCode;
    const tran_id = `ORDER-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
    await Order.create({
        user: dbUser._id,
        customerName: foundUser.name || deliveryName,
        customerEmail: foundUser.email,
        items,
        totalItems,
        deliveryName,
        deliveryAddress,
        promocode: appliedPromoCode || undefined,
        discountAmmount: discountAmmount || undefined,
        paymentStatus: "pending",
        orderStatus: "placed",
        totalAmmount: totalAmount,
        sslCommercePayOrderId: tran_id,
        paymentId: tran_id,
        paidAt: new Date(),
    });
    const paymentData = {
        total_amount: totalAmount,
        currency: "BDT",
        tran_id,
        success_url: `${BASE_URL}/customer/order/success`,
        fail_url: `${BASE_URL}/customer/order/fail`,
        cancel_url: `${BASE_URL}/customer/order/cancel`,
        ipn_url: `${BASE_URL}/customer/order/ipn`,
        shipping_method: "Courier",
        product_name: `Order ${tran_id}`,
        product_category: "General",
        product_profile: "general",
        cus_name: foundUser.name || deliveryName,
        cus_email: foundUser.email || "",
        cus_add1: deliveryAddress,
        cus_add2: "",
        cus_city,
        cus_state: cus_city,
        cus_postcode,
        cus_country: "Bangladesh",
        cus_phone: "",
        cus_fax: "",
        ship_name: deliveryName,
        ship_add1: deliveryAddress,
        ship_add2: "",
        ship_city: "",
        ship_state: "",
        ship_postcode: 0,
        ship_country: "Bangladesh",
    };
    const sslResponse = await initPayment(paymentData);
    res.status(200).json(successResponse({
        GatewayPageURL: sslResponse.GatewayPageURL,
    }));
});
export const orderSuccess = asyncHandler(async (req, res) => {
    const { val_id, tran_id } = req.body();
    if (val_id) {
        const validation = await validatePayment(val_id);
        if (validation?.status === "VALID" ||
            validation.status === "VALIDATION") {
            await Order.findOneAndUpdate({
                sslCommercePayOrderId: tran_id,
            }, {
                paymentStatus: "paid",
                paymentId: val_id,
                paidAt: new Date(),
            });
        }
    }
    res.redirect(`${FRONTEND_URL}/order/success?tran_id=${tran_id || ""}`);
});
export const orderFail = asyncHandler(async (req, res) => {
    const { tran_id } = req.body;
    if (tran_id) {
        await Order.findOneAndUpdate({ sslCommercePayOrderId: tran_id }, { paymentStatus: "failed" });
    }
    res.redirect(`${FRONTEND_URL}/order/failed?tran_id=${tran_id || ""}`);
});
export const orderCancel = asyncHandler(async (req, res) => {
    const { tran_id } = req.body;
    if (tran_id) {
        await Order.findOneAndUpdate({ sslCommercePayOrderId: tran_id }, { paymentStatus: "failed" });
    }
    res.redirect(`${FRONTEND_URL}/order/cancelled?tran_id=${tran_id || ""}`);
});
export const orderIpn = asyncHandler(async (req, res) => {
    const { val_id, tran_id, status } = req.body;
    if (val_id && (status === "VALID" || status === "VALIDATED")) {
        const validation = await validatePayment(val_id);
        if (validation?.status === "VALID" || validation?.status === "VALIDATED") {
            await Order.findOneAndUpdate({ sslCommercePayOrderId: tran_id }, { paymentStatus: "paid", paymentId: val_id, paidAt: new Date() });
        }
    }
    res.status(200).json(successResponse({ message: "IPN received" }));
});
