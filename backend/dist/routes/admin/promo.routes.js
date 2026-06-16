import { Router } from "express";
import { createPromo, deletePromo, getPromos, updatePromo, } from "../../controller/admin/promo.controller.js";
import { requiredAdmin } from "../../middleware/auth.js";
export const adminPromoRoute = Router();
adminPromoRoute.use(requiredAdmin);
adminPromoRoute.get("/promos", getPromos);
adminPromoRoute.post("/promos", createPromo);
adminPromoRoute.patch("/promos/:promoId", updatePromo);
adminPromoRoute.delete("/promos/:promoId", deletePromo);
