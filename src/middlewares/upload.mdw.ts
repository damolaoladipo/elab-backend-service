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
    req.body = {};

   stream.on("file", (fieldname, file, info) => {
  const passThrough = new PassThrough();
  let fileSize = 0;

  file.on("data", (chunk) => {
    fileSize += chunk.length;
    passThrough.write(chunk); 
  });

  file.on("end", () => {
    passThrough.end();
    

    files.push({
      fieldname,
      stream: passThrough,
      fileName: info.filename,
      mimeType: info.mimeType,
      info,
      size: fileSize,
    });
  });

  file.on("error", (err) => {
    passThrough.destroy(err);
    return next(err);
  });
});

    stream.on("field", (name, value) => {
      req.body[name] = value;
    });

    console.log("REQ.BODY:", req.body);

    stream.on("finish", () => {

      (req as any).files = files;

           console.log("✅ Parsed fields:", req.body);
      console.log("✅ Parsed files:", files.map(f => f.fieldname));
      next();
    });

    stream.on("error", (err) => {
      next(err);
    });

    req.pipe(stream);
  }
);

export default uploadFile;
