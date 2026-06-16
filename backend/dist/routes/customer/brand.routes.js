import { Router } from "express";
import { getBrand } from "../../controller/customer/brand.controller.js";
export const customerBrandRoute = Router();
customerBrandRoute.get("/brands", getBrand);
