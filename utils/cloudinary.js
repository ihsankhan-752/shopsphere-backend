import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

export const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};
