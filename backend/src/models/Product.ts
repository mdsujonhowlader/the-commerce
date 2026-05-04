import mongoose, { HydratedDocument, Schema, Types } from "mongoose";

export type ProductImage = {
  url: string;
  publicId: string;
  isCover: boolean;
};
export type ProductSize = "S" | "M" | "L" | "XL" | "XXL";
export type ProductStatus = "active" | "inactive";
export type Product = {
  title: string;
  description: string;
  category: Types.ObjectId;
  brand: Types.ObjectId;
  stock: number;
  price: number;
  images: ProductImage[];
  colors: string[];
  sizes: ProductSize[];
  salePercentage: number;
  status: ProductStatus;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updateAt: Date;
};

export type ProductDocument = HydratedDocument<Product>;
const productImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      type: String,
      required: true,
      trim: true,
    },
    isCover: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

export const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    images: {
      type: [productImageSchema],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    sizes: {
      type: [String],
      default: [],
      enum: ["S", "M", "L", "XL"],
    },
    salePercentage: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Product =
  mongoose.models.Product ||
  mongoose.model<ProductDocument>("Product", ProductSchema);
