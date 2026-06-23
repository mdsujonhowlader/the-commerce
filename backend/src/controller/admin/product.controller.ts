import { type Request, type Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Product } from "../../models/Product.js";
import { successResponse } from "../../utils/envelope.js";
import {
  requireFound,
  requireNumber,
  requireText,
} from "../../utils/helper.js";
import { Category } from "../../models/Category.js";
import { Brand } from "../../models/Brand.js";
import { AppError } from "../../utils/AppError.js";
import {
  deleteImgFromCloudinary,
  uploadManyBuffersToCloudinary,
} from "../../utils/cloudinary.js";
import { getDbUserFromReq } from "../../middleware/auth.js";

type UploadedImage = {
  url: string;
  publicId: string;
  isCover: boolean;
};

export const createProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const title = String(req.body.title || "").trim();
    const description = String(req.body.description || "").trim();
    const category = String(req.body.category || "").trim();
    const brand = String(req.body.brand || "").trim();
    const stock = Number(req.body.stock);

    const price = Number(req.body.price);
    const colors = req.body.colors || [];
    const sizes = req.body.sizes || [];
    const salePercentage = Number(req.body.salePercentage || 0);
    const status = String(req.body.status || "active").trim();

    requireText(title, "Title is Required");
    requireText(description, "Description is Required");

    requireText(category, "Category is Required");
    requireText(brand, "Brand is Required");

    requireNumber(price, "Price is Required");

    requireNumber(stock, "Stock is Required");
    requireNumber(salePercentage, "Percentage is Required");

    const existingCategory = await Category.findById(category);
    requireFound(existingCategory, "Category not found", 404);

    const existingBrand = await Brand.findById(brand);
    requireFound(existingBrand, "Brand  not found", 404);

    const files = (req.files as Express.Multer.File[]) || [];

    if (!files.length) {
      throw new AppError(400, "at least one file is required");
    }
    const uploadImages = await uploadManyBuffersToCloudinary(
      files.map((file) => file.buffer),
    );
    const images = uploadImages.map((img, index) => ({
      url: img.url,
      publicId: img.publicId,
      isCover: index === 0,
    }));

    const user = await getDbUserFromReq(req);
    const product = await Product.create({
      title,
      description,
      category,
      brand,
      images,
      price,
      sizes,
      salePercentage,
      colors,
      stock,
      status,
      createdBy: user._id,
    });
    await product.populate([
      { path: "category", select: "name" },
      { path: "brand", select: "name" },
    ]);

    res.status(201).json(successResponse(product));
  },
);

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

export const updateProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const productId = req.params.id as string;
    const title = String(req.body.title || "").trim();
    const description = String(req.body.description || "").trim();
    const category = String(req.body.category || "").trim();
    const brand = String(req.body.brand || "").trim();
    const stock = Number(req.body.stock);

    const price = Number(req.body.price);
    const colors = req.body.colors || [];
    const sizes = req.body.sizes || [];
    const salePercentage = Number(req.body.salePercentage || 0);
    const status = String(req.body.status || "active").trim() as
      | "active"
      | "inactive";

    const coverImagePublicId = String(req.body.coverImagePublicId || "").trim();

    requireText(title, "Title is Required");
    requireText(description, "Description is Required");
    requireText(category, "Category is Required");
    requireText(brand, "Brand is Required");

    requireNumber(price, "Price is Required");
    requireNumber(stock, "Stock is Required");
    requireNumber(salePercentage, "Percentage is Required");

    const existingCategoryDoc = await Category.findById(category);
    const existingCategory = requireFound(
      existingCategoryDoc,
      "Category not found",
    );

    const existingBrandDoc = await Brand.findById(brand);
    const existingBrand = requireFound(existingBrandDoc, "Brand  not found");

    const productDoc = await Product.findById(productId);
    const product = requireFound(productDoc, "Product not Found");

    const files = (req.files as Express.Multer.File[]) || [];

    const uploadNewImages = await uploadManyBuffersToCloudinary(
      files.map((file) => file.buffer),
    );
    const newlyAddedImages = uploadNewImages.map((image) => ({
      url: image.url,
      publicId: image.publicId,
      isCover: false,
    }));
    const existingImages: UploadedImage[] = product.images.map(
      (img: UploadedImage) => ({
        url: img.url,
        publicId: img.publicId,
        isCover: img.isCover,
      }),
    );

    const mergedImages: UploadedImage[] = [
      ...existingImages,
      ...newlyAddedImages,
    ];
    if (!mergedImages.length) {
      throw new AppError(400, "Atleast one img is needed");
    }

    const finalImages: UploadedImage[] = mergedImages.map(
      (image: UploadedImage, index) => ({
        url: image.url,
        publicId: image.publicId,
        isCover: coverImagePublicId
          ? image.publicId === coverImagePublicId
          : index === 0,
      }),
    );
    product.title = title;
    product.description = description;
    product.category = existingCategory._id;
    product.brand = existingBrand._id;
    product.stock = stock;
    product.colors = colors;
    product.sizes = sizes;
    product.salePercentage = salePercentage;
    product.price = price;
    product.status = status;
    product.set("images", finalImages);

    await product.save();

    await product.populate([
      { path: "category", select: "name" },
      { path: "brand", select: "name" },
    ]);

    res.status(200).json(successResponse(product));
  },
);

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const productId = req.params.id as string;

    const productDoc = await Product.findById(productId);
    const product = requireFound(productDoc, "Product not Found");

    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map((image:UploadedImage) => {
        if (image.publicId) {
          return deleteImgFromCloudinary(image.publicId);
        }
      });
      await Promise.all(deletePromises);
    }
    await product.deleteOne();
    res
      .status(200)
      .json(successResponse({ message: "Product Deleted Successfully" }));
  },
);
