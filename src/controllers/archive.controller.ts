import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import validationService from "../services/validate.service";
import { CreateArchiveDTO, UpdateArchiveDTO } from "../dtos/archive.dto";
import archiveRepository from "../repositories/archive.repository";
import uploadService from "../services/upload.service";
import userRepository from "../repositories/user.repository";



/**
 * @name createArchive
 * @description Creates a new archive
 * @route POST /archives
 * @access Private
 */
export const createArchive = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;

    const {
      title,
      excerpt,
      category,
      content,
      link,
      author,
      tags,
      status,
    }: CreateArchiveDTO = req.body;

    const validate = await validationService.validateCreateArchive(req.body);
    if (validate.error) {
      return next(new ErrorResponse("Validation Error", 400, [validate.message]));
    }

    const data = {
      title,
      excerpt,
      category,
      image: "",
      content,
      link,
      author,
      tags,
      status: "draft",  
      resourceLink: "",
      user: userId,
    };

    const archive = await archiveRepository.createArchive(data);
    if (archive.error) {
      return next(new ErrorResponse("Error", archive.code!, [archive.message]));
    }

    const files = (req as any).files || [];
    const imageFile = files.find((f: any) => f.fieldname === "image");
    const resourceFile = files.find((f: any) => f.fieldname === "resourceLink");

    let imageUrl = "";
    let resourceUrl = "";

    if (imageFile) {
      imageUrl = await uploadService.uploadFile({
        stream: imageFile.stream,
        mimeType: imageFile.mimeType,
        originalFileName: imageFile.fileName,
        refId: archive.data._id,
      });
    }

    if (resourceFile) {
      resourceUrl = await uploadService.uploadFile({
        stream: resourceFile.stream,
        mimeType: resourceFile.mimeType,
        originalFileName: resourceFile.fileName,
        refId: archive.data._id,
      });
    }

    await archiveRepository.updateArchive(archive.data._id, {
      image: imageUrl,
      resourceLink: resourceUrl,
    });

    res.status(200).json({
      error: false,
      errors: [],
      data: { ...archive.data, image: imageUrl, resourceLink: resourceUrl },
      message: "Archive created successfully.",
      status: 201,
    });
  }
);


/**
 * @name publishArchive
 * @description Publishes an existing archive
 * @route PATCH /archives/:id/publish
 * @access Private
 */
export const publishArchive = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const archiveId = req.params.id;

    const archive = await archiveRepository.findById(archiveId);
    if (archive.error || !archive.data) {
      return next(new ErrorResponse("Archive not found", 404, []));
    }

    if (archive.data.status === "published") {
      return next(new ErrorResponse("Archive already published", 400, []));
    }

    const updated = await archiveRepository.updateArchive(archiveId, {
      status: "published",
    });

    if (updated.error) {
      return next(new ErrorResponse("Failed to publish archive", 500, []));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: updated.data,
      message: "Archive published successfully.",
      status: 200,
    });
  }
);



/**
 * @name updateArchive
 * @description Updates an archive
 * @route PATCH /archives/:id
 * @access Private
 */
export const updateArchive = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const archiveId = req.params.id;

    const {
      title,
      excerpt,
      category,
      content,
      link,
      author,
      tags,
      status,
    }: UpdateArchiveDTO = req.body;

    const validate = await validationService.validateUpdateArchive(req.body);
    if (validate.error) {
      return next(new ErrorResponse("Validation Error", 400, [validate.message]));
    }

    const existing = await archiveRepository.findById(archiveId);
    if (!existing) {
      return next(new ErrorResponse("Archive not found", 404, [ "Not found"]));
    }

    let imageUrl = existing.data.image || "";
    let resourceUrl = existing.data.resourceLink || "";

    const files = (req as any).files || [];
    const imageFile = files.find((f: any) => f.fieldname === "image");
    const resourceFile = files.find((f: any) => f.fieldname === "resourceLink");

    if (imageFile) {
      imageUrl = await uploadService.uploadFile({
        stream: imageFile.stream,
        mimeType: imageFile.mimeType,
        originalFileName: imageFile.fileName,
        refId: existing.data._id,
      });
    }

    if (resourceFile) {
      resourceUrl = await uploadService.uploadFile({
        stream: resourceFile.stream,
        mimeType: resourceFile.mimeType,
        originalFileName: resourceFile.fileName,
        refId: existing.data._id,
      });
    }

    const updated = await archiveRepository.updateArchive(archiveId, {
      title,
      excerpt,
      category,
      content,
      link,
      author,
      tags,
      status,
      image: imageUrl,
      resourceLink: resourceUrl,
    });

    if (updated.error) {
      return next(new ErrorResponse("Update failed", 500, [updated.message]));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: updated.data,
      message: "Archive updated successfully.",
      status: 200,
    });
  }
);


/**
 * @name getArchiveById
 * @description Get archive by ID
 * @route GET /archives/:id
 * @access Public
 */
export const getArchiveById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await archiveRepository.findById(id);
    if (!result || result.error) {
      return next(new ErrorResponse("Archive not found", 404, [result?.message || "Not found"]));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: result.data,
      message: "Archive fetched successfully.",
      status: 200,
    });
  }
);


/**
 * @name getUserArchives
 * @description Get all archives for a specific user
 * @route GET /users/:userId/archives
 * @access Public
 */
export const getUserArchives = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    const user = await userRepository.findById(userId);
    if (!user || user.error) {
      return next(new ErrorResponse("User not found", 404, ["User not found"]));
    }

    const result = await archiveRepository.getUserArchives(userId);

    res.status(200).json({
      error: false,
      errors: [],
      data: result.data,
      message: "User archives fetched successfully.",
      status: 200,
    });
  }
);


/**
 * @name getArchives
 * @description Get all archives
 * @route GET /archives
 * @access Public
 */
export const getArchives = asyncHandler(
  async (_req: Request, res: Response) => {
    const result = await archiveRepository.getArchives();

    res.status(200).json({
      error: false,
      errors: [],
      data: result.data,
      message: "Archives fetched successfully.",
      status: 200
    });
  }
);

/**
 * @name deleteArchive
 * @description Deletes an archive
 * @route DELETE /archives/:id
 * @access Private
 */
export const deleteArchive = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const archive = await archiveRepository.findById(id);
    if (!archive) {
      return next(new ErrorResponse("Error", 404, ["Archive not found"]));
    }

    const result = await archiveRepository.deleteArchive(id);

    if (result.error) {
      return next(new ErrorResponse("Error", result.code!, [result.message]));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: result.data,
      message: result.message,
      status: 200
    });
  }
);
