import { Router } from "express";
import { getAdminOrder, patchAdminOrderStatus, } from "../../controller/admin/order.controller.js";
import { requiredAdmin } from "../../middleware/auth.js";
export const adminOrderRoute = Router();
adminOrderRoute.get("/orders", requiredAdmin, getAdminOrder);
adminOrderRoute.patch("/orders/:orderId/status", requiredAdmin, patchAdminOrderStatus);
