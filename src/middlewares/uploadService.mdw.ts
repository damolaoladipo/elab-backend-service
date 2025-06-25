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
  stream: PassThrough | Readable;
  mimeType: string;
  originalFileName: string;
  userId: string;
  eventId: string;
}

export const uploadToS3AndSaveImage = async ({
  stream,
  mimeType,
  originalFileName,
  userId,
  eventId,
}: UploadImageOptions): Promise<string> => {
  
    // 1. Validate supported image types
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedMimeTypes.includes(mimeType)) {
    throw new Error("Unsupported image format. Only JPG, PNG, and WebP allowed.");
  }

  // 2. Create unique file key
  const ext = path.extname(originalFileName);
  const fileId = uuidv4();
  const uniqueFileName = `events/${eventId}/${fileId}${ext}`;

  // 3. Upload to S3
  const upload = new Upload({
    client: s3,
    params: {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: uniqueFileName,
      Body: stream,
      ContentType: mimeType,
    },
  });

  await upload.done();

  // 4. Generate public URL
  //const fileUrl = `https://${process.env.AWS_CLOUDFRONT_URL}/${uniqueFileName}`;
  const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;


  // 5. Save image URL to event document
  const updatedEvent: IEventDoc | null = await Event.findByIdAndUpdate(
    eventId,
    { image: fileUrl },
    { new: true }
  );

  if (!updatedEvent) {
    throw new Error("Event not found or could not update image.");
  }

  return fileUrl;
};
