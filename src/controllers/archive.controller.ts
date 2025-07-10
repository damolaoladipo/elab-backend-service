import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import validationService from "../services/validate.service";
import { CreateArchiveDTO, UpdateArchiveDTO } from "../dtos/archive.dto";
import archiveRepository from "../repositories/archive.repository";
import uploadService from "../services/upload.service";
import userRepository from "../repositories/user.repository";
import { IArchiveDoc } from "../utils/interface.util";
import { generateSlug } from "../utils/helper.util";

/**
 * @name createArchive
 * @description Creates a new archive
 * @route POST /archives
 * @access Private
 */
export const createArchive = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    if (!userId) {
      return next(new ErrorResponse("Error", 401, ["Unauthorized user"]));
    }

    const { title, content, link, author, category, tags }: CreateArchiveDTO =
      req.body;

    const validate = await validationService.validateCreateArchive(req.body);
    if (validate.error) {
      return next(
        new ErrorResponse("Validation Error", 400, [validate.message])
      );
    }

    const data = {
      title,
      image: "",
      content,
      link,
      author,
      category,
      tags,
      status: "draft",
      resourceLink: "",
      user: userId,
    };

    const archive = await archiveRepository.createArchive(data);
    if (archive.error) {
      return next(new ErrorResponse("Error", archive.code!, [archive.message]));
    }

    const imageFile = (req as any).files.find(
      (f: any) => f.fieldname === "image"
    );
    const resourceFile = (req as any).files.find(
      (f: any) => f.fieldname === "resourceLink"
    );

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

    const archive = await archiveRepository.findArchive(archiveId);
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
 * @name unpublishArchive
 * @description Unpublishes an existing archive
 * @route PATCH /archives/:id/unpublish
 * @access Private
 */
export const unpublishArchive = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const archiveId = req.params.id;

    const archive = await archiveRepository.findArchive(archiveId);
    if (archive.error || !archive.data) {
      return next(new ErrorResponse("Archive not found", 404, []));
    }

    if (archive.data.status === "draft") {
      return next(new ErrorResponse("Archive already unpublished", 400, []));
    }

    const updated = await archiveRepository.updateArchive(archiveId, {
      status: "draft",
    });

    if (updated.error) {
      return next(new ErrorResponse("Failed to unpublish archive", 500, []));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: updated.data,
      message: "Archive unpublished successfully.",
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
    const userId = (req as any).user?.id;
    if (!userId) {
      return next(new ErrorResponse("Unauthorized", 401, []));
    }

    const archiveId = req.params.id;

    const {
      title,
      category,
      content,
      link,
      author,
      tags,
      status,
    }: UpdateArchiveDTO = req.body;

    const files = (req as any).files || [];
    const imageFile = files.find((f: any) => f.fieldname === "image");
    const resourceFile = files.find((f: any) => f.fieldname === "resourceLink");

    const hasBodyUpdate =
      title || category || content || link || author || (tags && tags.length > 0) || status;

    const hasFileUpdate = imageFile || resourceFile;

    if (!hasBodyUpdate && !hasFileUpdate) {
      return next(new ErrorResponse("update data is empty", 400, []));
    }

    const validate = await validationService.validateUpdateArchive(req.body);
    if (validate.error) {
      return next(new ErrorResponse(validate.message, 400, []));
    }

    const existing = await archiveRepository.findArchive(archiveId);
    if (existing.error) {
      return next(new ErrorResponse(existing.message, 404, []));
    }

    const updatePayload: Partial<IArchiveDoc> = {};

    // Title and slug update
    if (title && title !== existing.data.title) {
      updatePayload.title = title;

      const slug = await generateSlug({
        input: title,
        slugExistsFn: archiveRepository.slugExists.bind(archiveRepository),
      });

      updatePayload.slug = slug;
    }

    if (category && category !== existing.data.category) {
      updatePayload.category = category;
    }
    if (content && content !== existing.data.content) {
      updatePayload.content = content;
    }
    if (link && link !== existing.data.link) {
      updatePayload.link = link;
    }
    if (author && author !== existing.data.author) {
      updatePayload.author = author;
    }
    if (tags && tags.length > 0) {
      updatePayload.tags = tags;
    }
    if (status && status !== existing.data.status) {
      updatePayload.status = status;
    }

    // Upload image if provided
    if (imageFile) {
      const imageUrl = await uploadService.uploadFile({
        stream: imageFile.stream,
        mimeType: imageFile.mimeType,
        originalFileName: imageFile.fileName,
        refId: existing.data._id,
      });

      if (imageUrl && imageUrl !== existing.data.image) {
        updatePayload.image = imageUrl;
      }
    }

    // Upload resource file if provided
    if (resourceFile) {
      const resourceUrl = await uploadService.uploadFile({
        stream: resourceFile.stream,
        mimeType: resourceFile.mimeType,
        originalFileName: resourceFile.fileName,
        refId: existing.data._id,
      });

      if (resourceUrl && resourceUrl !== existing.data.resourceLink) {
        updatePayload.resourceLink = resourceUrl;
      }
    }

    const updated = await archiveRepository.updateArchive(archiveId, updatePayload);
    if (updated.error) {
      return next(new ErrorResponse(updated.message, updated.code, []));
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
 * @name getArchive
 * @description Get a specific archive by slug or ID
 * @route GET /archives/:slug
 * @access Public
 */
export const getArchive = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;

    const archive = await archiveRepository.findArchive(slug);

    if (archive.error) {
      return next(new ErrorResponse(archive.message, archive.code!, []));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: archive.data,
      message: archive.message,
      status: archive.code,
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

    const user = await userRepository.findUser(userId);
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
      status: 200,
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

    const archive = await archiveRepository.findArchive(id);
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
      status: 200,
    });
  }
);
