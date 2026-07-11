import type { Request, Response } from "express";
import { getDbUserFromReq } from "../../middleware/auth.js";
import { Banner, BannerItemDocument } from "../../models/Banner.js";
import { AppError } from "../../utils/AppError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadManyBuffersToCloudinary } from "../../utils/cloudinary.js";
import { successResponse } from "../../utils/envelope.js";

type AdminBannerItem = {
  _id: string;
  imageUrl: string;
  imagePublicId: string;
  createdAt: string;
};

function mapBanner(item: BannerItemDocument): AdminBannerItem {
  return {
    _id: String(item._id),
    imageUrl: item.imageUrl,
    imagePublicId: item.imagePublicId,
    createdAt: item.createdAt.toISOString(),
  };
}

const BANNER_FOLDER = "ecom-products/banners";

export const getAllBanner = asyncHandler(
  async (req: Request, res: Response) => {
    const bannerItems = await Banner.find().sort({ createdAt: -1 });

    res.json(
      successResponse({
        items: bannerItems.map(mapBanner),
      }),
    );
  },
);

export const uploadManyBanner = asyncHandler(
  async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);

    const files = (req.files || []) as Express.Multer.File[];

    if (!files.length) {
      throw new AppError(400, "At least one Image is Required");
    }
    const uploadImages = await uploadManyBuffersToCloudinary(
      files.map((file) => file.buffer),
      BANNER_FOLDER,
    );
    const createFinalBanner = await Banner.insertMany(
      uploadImages.map((item) => ({
        imageUrl: item.url,
        imagePublicId: item.publicId,
        createdBy: String(dbUser._id),
      })),
    );
    res.json(
      successResponse({
        items: createFinalBanner.map(mapBanner),
      }),
    );
  },
);
