import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { customerApplyPromos } from "../../controller/customer/promo.controller.js";
export const customerPromoRoute = Router();
customerPromoRoute.use(requireAuth);
customerPromoRoute.post("/promos/apply", customerApplyPromos);
