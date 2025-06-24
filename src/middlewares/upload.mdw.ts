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

    const bb = busboy({
      headers: req.headers as IncomingHttpHeaders,
      limits: {
        files: 10, 
        fileSize: 100 * 1024 * 1024,
      },
    });

    const uploadedFiles: UploadedFile[] = [];

    bb.on("file", (fieldname, file, info) => {
      const passthrough = new PassThrough();
      file.pipe(passthrough);

      let fileSize = 0;

      file.on("data", (chunk) => {
        fileSize += chunk.length;
      });

      file.on("end", () => {
        passthrough.end();
      });

      file.on("limit", () => {
        passthrough.destroy();
        return next(new Error(`File size limit reached for ${info.filename}`));
      });

      file.on("error", (err) => {
        passthrough.destroy();
        return next(err);
      });

      uploadedFiles.push({
        stream: passthrough,
        info,
        mimeType: info.mimeType,
        fileName: info.filename,
        size: fileSize,
        fieldname,
      });
    });

    bb.on("field", (name, val) => {
      req.body[name] = val;
    });

    bb.on("finish", () => {
      if (!uploadedFiles.length) {
        return next(new Error("No files uploaded"));
      }

      // Attach as req.files (array of files)
      (req as any).files = uploadedFiles;
      next();
    });

    bb.on("error", (err) => {
      return next(err);
    });

    req.pipe(bb);
  }
);

export default uploadFile;