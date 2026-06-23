import mongoose, { HydratedDocument, Types, Schema, model } from "mongoose";

export type BannerItem = {
  imageUrl: string;
  imagePublicId: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updateAt: Date;
};
export type BannerItemDocument = HydratedDocument<BannerItem>;

const BannerSchema = new Schema<BannerItem>(
  {
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    imagePublicId: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Banner =
  mongoose.models.Banner || model<BannerItem>("Banner", BannerSchema);
