import mongoose, { HydratedDocument, Schema, Types } from "mongoose";

export type Wishlist = {
  user: Types.ObjectId;
  products: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
};

export type WishlistDocument = HydratedDocument<Wishlist>;

const WishlistSchema = new mongoose.Schema<Wishlist>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  products: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
},{timestamps:true,versionKey:false});

export const Wishlist =
  mongoose.models.Wishlist || mongoose.model<Wishlist>("Wishlist", WishlistSchema);