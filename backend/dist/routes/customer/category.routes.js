import { Router } from "express";
import { getCategories } from "../../controller/customer/category.controller.js";
export const customerCategoryRoute = Router();
customerCategoryRoute.get("/categories", getCategories);
