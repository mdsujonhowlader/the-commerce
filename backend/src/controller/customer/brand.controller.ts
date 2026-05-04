import { type Request, type Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/envelope.js";
import { Brand } from "../../models/Brand.js";

export const getBrand = asyncHandler(async (_req: Request, res: Response) => {
  const brands = await Brand.find({}).sort({ name: 1 });

  res.status(200).json(successResponse(brands));
});
