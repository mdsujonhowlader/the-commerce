import mongoose from "mongoose";
export const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }
}, { timestamps: true, versionKey: false });
export const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
