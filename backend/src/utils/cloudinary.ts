import { Readable } from "stream";
import { v2 as cloudinary } from "cloudinary";

type cloudinaryUploadResult = {
  url: string;
  publicId: string;
};

export async function singleFilUploadToCloudinary(
  file: Buffer,
  folder = "ecom-products",
): Promise<cloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
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
      },
    );
    const readableStream = Readable.from(file);
    readableStream.pipe(uploadStream);
  });
}

export async function uploadManyBuffersToCloudinary(
  files: Buffer[],
  folder = "ecom-products",
): Promise<cloudinaryUploadResult[]> {
  return Promise.all(
    files.map((file) => singleFilUploadToCloudinary(file, folder)),
  );
}
