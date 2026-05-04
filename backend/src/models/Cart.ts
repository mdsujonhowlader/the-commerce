import mongoose, { HydratedDocument, Schema, Types } from "mongoose";

export type CartItem = {
  product: Types.ObjectId;
  quantity: number;
  color?: string;
  size?: string;
};

export type Cart = {
  user: Types.ObjectId;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
};

export type CartDocument = HydratedDocument<Cart>;

const cartItemSchema = new mongoose.Schema<CartItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    color: {
      type: String,
      trim: true,
    },
    size: {
      type: String,
      enum: ["S", "M", "L", "XL"],
    },
  },
  { _id: false },
);

const CartSchema = new mongoose.Schema<Cart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  { timestamps: true, versionKey: false },
);

export const Cart =
  mongoose.models.Cart || mongoose.model<Cart>("Cart", CartSchema);
