import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { PassThrough } from "stream";
import Event from "../models/Event.model";
import { IEventDoc } from "../utils/interface.util";
import { Readable } from "stream";

// Config
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

interface UploadImageOptions {
  stream: PassThrough;
  mimeType: string;
  originalFileName: string;
  refId: string;
}

/**
 * Uploads an image to S3 and saves the image URL to the event document.
 *
 * @param {UploadImageOptions} data - The data containing the image stream, MIME type, and original file name.
 * @returns {Promise<string>} - The public URL of the uploaded image.
 * @throws {Error} - If the image format is unsupported or if the event cannot be updated.
 */

export const uploadToS3AndSaveImage = async (
  data: UploadImageOptions
): Promise<string> => {
  const { stream, mimeType, originalFileName, refId } = data;

  // 1. Validate supported image types
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedMimeTypes.includes(mimeType)) {
    throw new Error(
      "Unsupported image format. Only JPG, PNG, and WebP allowed."
    );
  }

  // 2. Create unique file key
  const ext = path.extname(originalFileName);
  const fileId = uuidv4();
  const uniqueFileName = `events/${fileId}${ext}`;

  // 3. Upload to S3
  const upload = new Upload({
    client: s3,
    params: {
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key: uniqueFileName,
      Body: stream,
      ContentType: mimeType,
    },
  });

  await upload.done();

  // 4. Generate public URL
  //const fileUrl = `https://${process.env.AWS_CLOUDFRONT_URL}/${uniqueFileName}`;
  const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;

  return fileUrl;
};
