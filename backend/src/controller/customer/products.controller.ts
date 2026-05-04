import { type Request, type Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/envelope.js";
import { Product } from "../../models/Product.js";
import { requireFound } from "../../utils/helper.js";

type ProductSort = "recent" | "price-high" | "price-low";

type ProductFilterListQuery = {
  category?: string;
  brand?: string;
  color?: string;
  size?: string;
  sort?: ProductSort;
};

export const getProducts = asyncHandler(
  async (req: Request<{}, {}, {}, ProductFilterListQuery>, res: Response) => {
    const category = (req.query.category || "").trim();
    const brand = (req.query.brand || "").trim();
    const color = (req.query.color || "").trim();
    const size = (req.query.size || "").trim();
    const sort: ProductSort = req.query.sort || "recent";

    const query: Record<string, unknown> = {
      status: "active",
    };
    if (category) {
      query.category = category;
    }
    if (brand) {
      query.brand = brand;
    }
    if (color) {
      query.color = color;
    }
    if (size) {
      query.size = size;
    }

    let sortOptions: Record<string, 1 | -1> = {
      createdAt: 1,
    };
    if (sort === "price-low") {
      sortOptions = { price: 1 };
    }
    if (sort === "price-high") {
      sortOptions = { price: -1 };
    }

    const products = await Product.find(query)
      .populate("category", "name")
      .populate("brand", "name")
      .sort(sortOptions);

    res.status(200).json(successResponse(products));
  },
);

export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const productId = req.params._id;
    const product = await Product.findOne({
      _id: productId,
      status: "active",
    })
      .populate("category", "name")
      .populate("brand", "name");

    const foundProduct = requireFound(product, "Product not found", 404);

    const relatedProducts = await Product.find({
      _id: { $ne: foundProduct._id },
      category: foundProduct.category,
      brand: foundProduct.brand,
      status: "active",
    })
      .populate("category", "name")
      .populate("brand", "name")
      .sort({ createdAt: -1 })
      .limit(4);

    res.status(200).json(
      successResponse({
        product: product,
        relatedProducts,
      }),
    );
  },
);
