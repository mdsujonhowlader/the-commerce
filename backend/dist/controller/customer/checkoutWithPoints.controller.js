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
export const checkoutPoints = asyncHandler(async (req, res) => {
    const dbUser = await getDbUserFromReq(req);
    const user = await User.findById(dbUser._id)
        .select("points")
        .lean();
    const foundUser = requireFound(user, "user not found", 404);
    res.json(successResponse({
        points: foundUser?.points || 0,
    }));
});
export const checkoutSessionForPoints = asyncHandler(async (req, res) => {
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
    if (totalAmount > foundUser.points) {
        throw new AppError(400, "Not enough points for this order");
    }
    const deductedUserPoints = await User.updateOne({
        _id: dbUser._id,
        points: { $gte: totalAmount },
    }, {
        $inc: { points: -totalAmount },
    });
    if (deductedUserPoints.matchedCount) {
        throw new AppError(400, "Not enough points for this order");
    }
    try {
        for (const item of items) {
            const updated = await Product.updateOne({
                _id: item.products,
                stock: { $gte: item.quantity },
            }, { $inc: { stock: -item.quantity } });
            if (!updated.matchedCount) {
                throw new AppError(400, "One or more cart items are out of stock");
            }
        }
        if (appliedPromoCode) {
            await Promo.updateOne({
                code: appliedPromoCode,
                count: { $gt: 0 },
            }, {
                $inc: { count: -1 },
            });
        }
        await Cart.updateOne({ user: dbUser._id }, { $set: { items: [] } });
        const pointsPaymentId = `points_${Date.now()}`;
        const deliveryAddress = [
            selectAddress.address,
            selectAddress.state,
            selectAddress.postalCode,
        ]
            .filter(Boolean)
            .join(", ");
        await Order.create({
            user: dbUser._id,
            customerName: foundUser.name || selectAddress.fullName,
            customerEmail: foundUser.email,
            items,
            totalItems,
            deliveryName: selectAddress.fullName,
            deliveryAddress,
            promocode: appliedPromoCode || undefined,
            discountAmmount: discountAmmount || undefined,
            paymentStatus: "paid",
            orderStatus: "placed",
            totalAmmount: totalAmount,
            sslCommercePayOrderId: pointsPaymentId,
            paymentId: pointsPaymentId,
            paidAt: new Date(),
        });
        const updateUser = await User.findById(dbUser._id)
            .select("points")
            .lean();
        res.json(successResponse({
            _id: String(dbUser._id),
            totalPoints: updateUser?.points || 0,
        }));
    }
    catch (error) {
        await User.updateOne({
            _id: dbUser._id,
        }, {
            $inc: { points: totalAmount },
        });
        throw error;
    }
});
