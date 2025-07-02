import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { PassThrough } from "stream";

interface UploadFileOptions {
  stream: PassThrough;
  mimeType: string;
  originalFileName: string;
  refId: string;
}

class UploadService {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  /**
   *
   * @name uploadFile
   * @description Uploads an image to S3 and returns the public URL.
   * @param {UploadFileOptions} data - The data containing the image stream, MIME type, and original file name.
   * @returns {Promise<string>} - The public URL of the uploaded image.
   * @throws {Error} - If the image format is unsupported or if the event cannot be updated.
   */

  public uploadFile = async (data: UploadFileOptions): Promise<string> => {
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
      client: this.s3,
      params: {
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: uniqueFileName,
        Body: stream,
        ContentType: mimeType,
      },
    });

    try {
      await upload.done();
    } catch (err) {
      console.error("S3 upload failed:", err);
      throw new Error("Upload failed. Please try again.");
    }

    // 4. Generate public URL
    //const fileUrl = `https://${process.env.AWS_CLOUDFRONT_URL}/${uniqueFileName}`;
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;

    return fileUrl;
  };
}

export default new UploadService();
