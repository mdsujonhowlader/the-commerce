import { asyncHandler } from "../../utils/asyncHandler.js";
import { Category } from "../../models/Category.js";
import { successResponse } from "../../utils/envelope.js";
export const getCategories = asyncHandler(async (_req, res) => {
    const categories = await Category.find({}).sort({ name: 1 });
    res.status(200).json(successResponse(categories));
});
