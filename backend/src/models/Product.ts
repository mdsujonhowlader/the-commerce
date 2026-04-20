import mongoose, { Schema } from "mongoose";





export const ProductSchema = new mongoose.Schema(
  {
    titile: {
      type: String,
      required: true,
      trim:true
    },
    description: {
      type: String,
      required: true,
      trim:true
    },
    category: {
      type: Schema.Types.ObjectId,
      ref:'Category',
      required: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref:'Brand',
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min:0
    },
    price: {
      type: Number,
      required: true,
    },

  },
  { timestamps: true, versionKey: false },
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
