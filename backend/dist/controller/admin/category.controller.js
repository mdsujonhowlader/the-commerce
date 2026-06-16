import { Category } from "../../models/Category.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/envelope.js";
import { requireFound, requireText } from "../../utils/helper.js";
export const getCategories = asyncHandler(async (_req, res) => {
    const categories = await Category.find({}).sort({
        name: 1,
    });
    res.status(200).json(successResponse(categories));
});
export const createCategory = asyncHandler(async (req, res) => {
    const categoryName = String(req.body.name || "").trim();
    requireText(categoryName, "Category name is required");
    const existingCategory = await Category.findOne({ name: categoryName });
    requireFound("Category not found", existingCategory);
    const category = await Category.create({ name: categoryName });
    res.status(201).json(successResponse(category));
});
export const updateCategory = asyncHandler(async (req, res) => {
    const categoryName = String(req.body.name || "").trim();
    const existingCategoryId = req.params.id;
    requireText(categoryName, "Category name is required");
    const existingCategory = await Category.findById(existingCategoryId);
    const category = requireFound(existingCategory, "Category not found");
    category.name = categoryName;
    await category.save();
    res.status(201).json(successResponse(category));
});
export const deleteCategory = asyncHandler(async (req, res) => {
    const cateId = req.params.id;
    const category = await Category.findById(cateId);
    requireFound(category, "Category not found");
    await category.delete();
    res.status(201).json(successResponse({ message: "Successfully Deleted" }));
});
