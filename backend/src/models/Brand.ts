import mongoose from "mongoose";
export const BrandSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true
    }
},{timestamps:true,versionKey:false})

export const Brand = mongoose.models.Brand || mongoose.model("Brand", BrandSchema);