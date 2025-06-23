import dotenv, { config, } from "dotenv";
import {v2 as cloudinary} from "cloudinary"

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = async (file: any) => {
  const image = await cloudinary.uploader.upload(
    file,
    { folder: "project" },
    (result: any) => result
  );
  return image;
};

export default upload;