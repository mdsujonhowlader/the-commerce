import mongoose, { HydratedDocument } from "mongoose";

export type Brand = {
  name: string;
  createdAt: Date;
  updatedAt: Date;
};
export type BrandDocument = HydratedDocument<Brand>;
export const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Brand =
  mongoose.models.Brand || mongoose.model<BrandDocument>("Brand", BrandSchema);
