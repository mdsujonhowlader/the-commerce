import { type Request, type Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Product } from "../../models/Product.js";
import { successResponse } from "../../utils/envelope.js";

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const search = String(req.query.search || "").trim();
  const query: Record<string, unknown> = {};
  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  const products = await Product.find(query)
    .populate("category", "name")
    .populate("brand", "name")
    .sort({ createdAt: -1 });

  res.status(200).json(successResponse(products));
});
