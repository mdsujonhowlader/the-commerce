import { Router } from "express";
import { createCategory, getCategories } from "./category.controller.js";
import {  requiredAdmin } from "../../middleware/auth.js";

export const adminCateRoute=Router()


adminCateRoute.get('/categories',getCategories)
adminCateRoute.post('/categories',requiredAdmin,createCategory)
adminCateRoute.put('/categories/:id',requiredAdmin,createCategory)
adminCateRoute.delete('/categories/:id',requiredAdmin,createCategory)