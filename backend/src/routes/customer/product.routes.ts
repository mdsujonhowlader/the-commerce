import { Router } from "express";
import {
  getProductById,
  getProducts,
} from "../../controller/customer/products.controller.js";

export const customerProductRoute = Router();

customerProductRoute.get("/products", getProducts);
customerProductRoute.get("/product/:id", getProductById);
