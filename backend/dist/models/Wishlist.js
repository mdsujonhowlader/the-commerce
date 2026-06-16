import mongoose, { Schema } from "mongoose";
const WishlistSchema = new mongoose.Schema({
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
}, { timestamps: true, versionKey: false });
export const Wishlist = mongoose.models.Wishlist || mongoose.model("Wishlist", WishlistSchema);
