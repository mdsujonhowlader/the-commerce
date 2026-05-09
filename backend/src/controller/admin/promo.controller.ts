import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Promo } from "../../models/Promo.js";
import { successResponse } from "../../utils/envelope.js";
import { Types } from "mongoose";
import { requireFound, requireText } from "../../utils/helper.js";
import { AppError } from "../../utils/AppError.js";

type PromoDbItem = {
  _id: Types.ObjectId;
  code: string;
  percentage: number;
  count: number;
  minimumOrderValue: number;
  startAt: Date;
  endsAt: Date;
  createdAt?: Date;
};

function mapPromo(item: PromoDbItem) {
  return {
    _id: String(item._id || ""),
    code: item.code,
    percentage: item.percentage,
    count: item.count,
    minimumOrderValue: item.minimumOrderValue,
    startAt: item.startAt,
    endsAt: item.endsAt,
    createdAt: item.createdAt,
  };
}

async function getAllPromo() {
  const allpromo = await Promo.find().sort({ createdAt: -1 });
  return allpromo.map((item) => mapPromo(item.toObject()));
}

function parsePromoPayload(req: Request) {
  const code = String(req.body.code || "")
    .trim()
    .toUpperCase();
  const percentage = Number(req.body.percentage);
  const count = Number(req.body.count);
  const minimumOrderValue = Number(req.body.minimumOrderValue);
  const startAt = new Date(req.body.startAt);
  const endsAt = new Date(req.body.endsAt);
  requireText(code, "Promo Code are Required");

  if (Number.isNaN(percentage) || percentage < 1 || percentage > 100) {
    throw new AppError(400, "Percentage must be between 1 and 10");
  }
  if (!Number.isInteger(count) || count < 1) {
    throw new AppError(400, "Count must be at least 1");
  }
  if (Number.isNaN(minimumOrderValue) || minimumOrderValue < 0) {
    throw new AppError(400, "Minimum Order must be at least  1 or more");
  }

  if (Number.isNaN(startAt.getTime())) {
    throw new AppError(400, "Valid start time is Required");
  }
  if (Number.isNaN(endsAt.getTime())) {
    throw new AppError(400, "Valid End time is Required");
  }
  if (endsAt <= startAt) {
    throw new AppError(400, "End Time should be after start time");
  }

  return {
    code,
    percentage,
    count,
    minimumOrderValue,
    startAt,
    endsAt,
  };
}
export const getPromos = asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json(
    successResponse({
      items: await getAllPromo(),
    }),
  );
});

export const createPromo = asyncHandler(async (req: Request, res: Response) => {
  const payload = parsePromoPayload(req);
  const existingCode = await Promo.findOne({ code: payload.code });

  if (existingCode) {
    throw new AppError(400, "Promo code already exists");
  }

  await Promo.create(payload);

  res.json(
    successResponse({
      items: await getAllPromo(),
    }),
  );
});

export const updatePromo = asyncHandler(async (req: Request, res: Response) => {
  const promoId = String(req.params.promoId || "").trim();
  requireText(promoId, "PromoId is required");

  const payload = parsePromoPayload(req);

  const promo = await Promo.findById(promoId);

  const foundPromo = requireFound(promo, "promo no found", 400);

  const existingPromo = await Promo.findOne({
    code: payload.code,
    _id: { $ne: foundPromo._id },
  });

  if (existingPromo) {
    throw new AppError(400, "Promo is already exists");
  }

  foundPromo.code = payload.code;
  foundPromo.percentage = payload.percentage;
  foundPromo.count = payload.count;
  foundPromo.minimumOrderValue = payload.minimumOrderValue;
  foundPromo.startAt = payload.startAt;
  foundPromo.endsAt = payload.endsAt;

  await foundPromo.save();
  res.json(
    successResponse({
      items: await getAllPromo(),
    }),
  );
});

export const deletePromo = asyncHandler(async (req: Request, res: Response) => {
  const promoId = String(req.params.promoId || "").trim();
  requireText(promoId, "PromoId is required");

  const promo = await Promo.findById(promoId);
  requireFound(promo, "promo no found", 400);

  await Promo.findByIdAndDelete(promoId);
  res.json(
    successResponse({
      items: await getAllPromo(),
    }),
  );
});
