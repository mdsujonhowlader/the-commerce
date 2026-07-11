import mongoose, { Schema, model } from "mongoose";
const BannerSchema = new Schema({
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
}, { timestamps: true, versionKey: false });
export const Banner = mongoose.models.Banner || model("Banner", BannerSchema);
