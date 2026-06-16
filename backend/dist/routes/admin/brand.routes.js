import { Router } from "express";
import { requiredAdmin } from "../../middleware/auth.js";
import { createBrand, deleteBrand, getBrand, updateBrand, } from "../../controller/admin/brand.controller.js";
export const adminBrandRoute = Router();
adminBrandRoute.get("/brands", requiredAdmin, getBrand);
adminBrandRoute.post("/brand", requiredAdmin, createBrand);
adminBrandRoute.put("/brand/:id", requiredAdmin, updateBrand);
adminBrandRoute.delete("/brand/:id", requiredAdmin, deleteBrand);
