import mongoose, { HydratedDocument } from "mongoose";

export type Category={
    name:string,
    createdAt:Date,
    updatedAt:Date
}
export type CategoryDocument=HydratedDocument<Category>;
export const CategorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true
    }
},{timestamps:true,versionKey:false})

export const Category = mongoose.models.Category || mongoose.model<CategoryDocument>("Category", CategorySchema);