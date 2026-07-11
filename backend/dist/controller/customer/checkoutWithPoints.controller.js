import { asyncHandler } from "../../utils/asyncHandler.js";
export const checkoutSessionForPoints = asyncHandler(async (req, res) => {
    const dbUser = await getDbUserFromReq(req);
    const addressId = String(req.body.addressId).trim();
    const promocode = String(req.body.promoCode || "");
});
