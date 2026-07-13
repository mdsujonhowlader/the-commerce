import { Router } from "express";
import { dashboardReport } from "../../controller/admin/dashboard.controller.js";
import { requiredAdmin } from "../../middleware/auth.js";
export const adminDashboardRoute = Router();
adminDashboardRoute.get("/dasboard/count", requiredAdmin, dashboardReport);
