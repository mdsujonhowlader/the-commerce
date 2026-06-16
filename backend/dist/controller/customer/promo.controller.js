import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/envelope.js";
import { requireText } from "../../utils/helper.js";
import { AppError } from "../../utils/AppError.js";
import { Promo } from "../../models/Promo.js";
export const customerApplyPromos = asyncHandler(async (req, res) => {
    const code = String(req.body.code || "")
        .trim()
        .toUpperCase();
    const orderValue = Number(req.body.orderValue) || 0;
    requireText(code, "Promo code is required");
    if (Number.isNaN(orderValue) || orderValue < 0) {
        throw new AppError(400, "Valid order value is required");
    }
    const promo = await Promo.findOne({ code });
    if (!promo) {
        throw new AppError(404, "PromoCode is not found");
    }
    const now = new Date();
    if (promo.startAt && now < promo.startAt) {
        throw new AppError(400, "Promo Code is not activated");
    }
    if (promo.endsAt && now > promo.endsAt) {
        throw new AppError(404, "Promo Code is expired");
    }
    if (promo.count !== null && promo.count < 1) {
        throw new AppError(400, "Promo Code usage limit exceeded");
    }
    if (orderValue < promo.minimumOrderValue) {
        throw new AppError(400, `Minimum order value for this promo is ${promo.minimumOrderValue}`);
    }
    res.json(successResponse({
        code: promo.code,
        percentage: promo.percentage,
        count: promo.count,
        minimumOrderValue: promo.minimumOrderValue,
    }));
});
