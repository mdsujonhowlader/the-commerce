import { type Request, type Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Category } from "../../models/Category.js";
import { successResponse } from "../../utils/envelope.js";

export const getCategories = asyncHandler(
  async (_req: Request, res: Response) => {
    const categories = await Category.find({}).sort({ name: 1 });

    res.status(200).json(successResponse(categories));
  },
);
