import { Readable } from "stream";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_URL_NAME,
    api_key: process.env.CLOUDINARY_URL_KEY,
    api_secret: process.env.CLOUDINARY_URL_API_SECRET,
});
export async function singleFilUploadToCloudinary(file, folder = "ecom-products") {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            folder,
            resource_type: "image",
        }, (error, result) => {
            if (error) {
                return reject(error);
            }
            if (!result) {
                return reject(new Error("Cloudinary Upload Failed"));
            }
            resolve({
                url: result.secure_url,
                publicId: result.public_id,
            });
        });
        const readableStream = Readable.from(file);
        readableStream.pipe(uploadStream);
    });
}
export async function uploadManyBuffersToCloudinary(files, folder = "ecom-products") {
    return Promise.all(files.map((file) => singleFilUploadToCloudinary(file, folder)));
}
//delete image
export const deleteImgFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    }
    catch (error) {
        console.error(`failed to delete image with publicId:${publicId}`, error);
    }
};
