import { NextFunction, Request, Response } from "express";
import asyncHandler from "./async.mdw";
import busboy, { FileInfo } from "busboy";
import { IncomingHttpHeaders } from "http";
import { PassThrough } from "stream";

type UploadedFile = {
  stream: PassThrough;
  info: FileInfo;
  mimeType: string;
  fileName: string;
  size: number;
  fieldname: string;
};

const uploadFile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const contentType = req.headers["content-type"];

    if (
      req.method !== "POST" ||
      !contentType?.includes("multipart/form-data")
    ) {
      return next();
    }

    const stream = busboy({
      headers: req.headers as IncomingHttpHeaders,
      limits: {
        files: 10,
        fileSize: 100 * 1024 * 1024, // 100MB
      },
    });

    
    let hasFile = false;
    let mimeType = "";
    let fileName = "";
    let fileSize = 0;
    let fileInfo: FileInfo | null = null;

    let uploadStream: PassThrough;


    stream.on("file", (fieldname, file, info) => {
      if (fieldname !== "file") {
        file.resume();
        return;
      }

      hasFile = true;
      fileInfo = info;
      mimeType = info.mimeType;
      fileName = info.filename;

      uploadStream = new PassThrough();

      file.on("data", (chunk) => {
        uploadStream.write(chunk);
        fileSize += chunk.length;
        console.log('file chunks', chunk.length)
      });

      file.on("end", () => {
        uploadStream.end();

        // Attach the final file metadata after stream ends
        (req as any).file = {
          stream: uploadStream,
          fileName,
          mimeType,
          info: fileInfo,
          size: fileSize,
        };

        console.log(`🟢 Finished streaming file: ${fileName}, size: ${fileSize} bytes`);
      });

      file.on("error", (err) => {
        uploadStream?.destroy(err);
        return next(err);
      });

      uploadStream.on("error", (err) => {
        return next(err);
      });

    });

    stream.on("field", (name, val) => {
      if (!req.body) req.body = {};
      req.body[name] = val;
    });

    stream.on("finish", () => {
      if (!hasFile) {
        return next(new Error("No file uploaded"));
      }
      next();
    });

    stream.on("error", (err) => {
      next(err);
    });

    req.pipe(stream);
  }
);

export default uploadFile;
