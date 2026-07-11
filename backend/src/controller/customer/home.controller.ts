import { type Request, type Response } from "express";
import { Types } from "mongoose";
import { Banner } from "../../models/Banner.js";
import { Brand } from "../../models/Brand.js";
import { Category } from "../../models/Category.js";
import { Product } from "../../models/Product.js";
import { Promo } from "../../models/Promo.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/envelope.js";

type BannerRow = {
  _id: Types.ObjectId;
  imageUrl: string;
  createdAt: Date;
};
type CategoryRow = {
  _id: Types.ObjectId;
  name: string;
};
type BrandRow = {
  _id: Types.ObjectId;
  name: string;
};
type ProductRow = {
  _id: Types.ObjectId;
  title: string;
  brand: string;
  price: number;
  salePercentage: number;
  images: Array<{
    url: string;
    isCover?: boolean;
  }>;
  createdAt: Date;
};

type PromoRow = {
  _id: Types.ObjectId;
  code: string;
  percentage: number;
  count: number;
  minimumOrderValue: number;
  endsAt: Date;
};

export const customerHomePageApi = asyncHandler(
  async (_req: Request, res: Response) => {
    const now = new Date();

    const [banners, categories, brands, recentProducts, promos] =
      await Promise.all([
        Banner.find().sort({ createdAt: -1 }).limit(6).lean<BannerRow[]>(),
        Category.find().sort({ name: 1 }).lean<CategoryRow[]>(),
        Brand.find().sort({ name: 1 }).lean<BrandRow[]>(),
        Product.find({ status: "active" })
          .select("title brand price salePercentage images createdAt")
          .sort({ createdAt: -1 })
          .limit(4)
          .lean<ProductRow[]>(),

        Promo.find({
          startAt: { $lte: now },
          endsAt: { $gte: now },
          count: { $gt: 0 },
        })
          .sort({ createdAt: -1 })
          .limit(4)
          .lean<PromoRow[]>(),
      ]);

    res.json(
      successResponse({
        banners: banners.map((bannerItem) => ({
          _id: String(bannerItem._id),
          imageUrl: bannerItem.imageUrl,
          createdAt: bannerItem.createdAt,
        })),
        categories: categories.map((categoryItem) => ({
          _id: String(categoryItem._id),
          name: categoryItem.name,
        })),
        brands: brands.map((brandItem) => ({
          _id: String(brandItem._id),
          name: brandItem.name,
        })),

        recentProducts: recentProducts.map((recentProductItem) => {
          const image =
            recentProductItem.images.find((item) => item.isCover)?.url ||
            recentProductItem.images[0]?.url ||
            "";

          const finalPrice = recentProductItem.salePercentage
            ? Math.round(
                recentProductItem.price -
                  (recentProductItem.price * recentProductItem.salePercentage) /
                    100,
              )
            : recentProductItem.price;

          return {
            _id: String(recentProductItem._id),
            title: recentProductItem.title,
            brand: recentProductItem.brand,
            price: recentProductItem.price,
            finalPrice,
            salePercentage: recentProductItem.salePercentage,
            image,
            createdAt: recentProductItem.createdAt.toISOString(),
          };
        }),
        coupons: promos.map((promoItem) => ({
          _id: String(promoItem._id),
          code: promoItem.code,
          percentage: promoItem.percentage,
          count: promoItem.count,
          minimumOrderValue: promoItem.minimumOrderValue,
          endsAt: promoItem.endsAt.toISOString(),
        })),
      }),
    );
  },
);
