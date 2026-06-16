import { Router } from "express";
import { createCategory, getCategories, updateCategory } from "../../controller/admin/category.controller.js";
import { requiredAdmin } from "../../middleware/auth.js";
export const adminCateRoute = Router();
adminCateRoute.get('/categories', requiredAdmin, getCategories);
adminCateRoute.post('/categories', createCategory);
adminCateRoute.put('/categories/:id', requiredAdmin, updateCategory);
adminCateRoute.delete('/categories/:id', requiredAdmin, createCategory);
