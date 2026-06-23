import mongoose, { HydratedDocument } from "mongoose";

export type IPromo = {
  code: string;
  percentage: number;
  count: number;
  minimumOrderValue: number;
  startAt: Date;
  endsAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type PromoDocument = HydratedDocument<IPromo>;

const PromoSchema = new mongoose.Schema<IPromo>({
  code: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  percentage: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },
  count: {
    type: Number,
    required: true,
    min: 1,
  },
  minimumOrderValue: {
    type: Number,
    required: true,
    min: 0,
  },
  startAt: {
    type: Date,
    required: true,
  },
  endsAt:{
    type: Date,
    required: true,
  }
},{timestamps:true,versionKey:false});

export const Promo =
  mongoose.models.Promo || mongoose.model<IPromo>("Promo", PromoSchema);