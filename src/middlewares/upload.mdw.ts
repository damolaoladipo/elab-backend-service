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

    const files: UploadedFile[] = [];
    req.body = req.body || {};

    stream.on("file", (fieldname, file, info) => {
      const passThroughWrite = new PassThrough();
      const passThroughRead = new PassThrough();
      let fileSize = 0;

      file.pipe(passThroughWrite);
      passThroughWrite.pipe(passThroughRead);

      file.on("data", (chunk) => {
        fileSize += chunk.length;
      });

      file.on("end", () => {
        files.push({
          fieldname,
          stream: passThroughRead,
          fileName: info.filename,
          mimeType: info.mimeType,
          info,
          size: fileSize,
        });
      });

      file.on("error", (err) => {
        passThroughWrite.destroy(err);
        passThroughRead.destroy(err);
        return next(err);
      });

      passThroughWrite.on("error", (err) => {
        return next(err);
      });
    });

    stream.on("field", (name, value) => {
      req.body[name] = value;
    });

    stream.on("finish", () => {
      if (files.length === 0) {
        return next(new Error("No files uploaded"));
      }

      (req as any).files = files;
      next();
    });

    stream.on("error", (err) => {
      next(err);
    });

    req.pipe(stream);
  }
);

export default uploadFile;
