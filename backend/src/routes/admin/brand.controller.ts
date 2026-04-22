import { type Request, type Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/envelope.js";
import { requireFound, requireText } from "../../utils/helper.js";
import { Brand } from "../../models/Brand.js";

export const getBrand = asyncHandler(
  async (_req: Request, res: Response) => {
    const brands = await Brand.find({}).sort({
      name: 1,
    });
    res.status(200).json(successResponse(brands));
  },
);

export const createBrand = asyncHandler(
  async (req: Request, res: Response) => {
    const brandName = String(req.body.name || "").trim();

    requireText(brandName, "Brand name is required");
    const existingCategory = await Brand.findOne({ name: brandName });
    requireFound(existingCategory, "Brand not found");
    const brand = await Brand.create({ name: brandName });
    res.status(201).json(successResponse(brand));
  },
);

export const updateBrand = asyncHandler(
  async (req: Request, res: Response) => {
    const brandName = String(req.body.name || "").trim();
    const existingBrandId = req.params.id;

    requireText(brandName, "Brand name is required");
    const existingBrand = await Brand.findById(existingBrandId);
    const brand = requireFound(existingBrand, "Brand not found");

    brand.name = brandName;

    await brand.save();
    res.status(201).json(successResponse(brand));
  },
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const brandId = req.params.id;

    const brand = await Brand.findById(brandId);
    requireFound(brand, "brand not found");
    await brand.delete();
    res.status(201).json(successResponse({ message: "Brand Successfully Deleted" }));
  },
);
