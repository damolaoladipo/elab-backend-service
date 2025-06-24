import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import validationService from "../services/validate.service";
import { CreateArchiveDTO, UpdateArchiveDTO } from "../dtos/archive.dto";
import archiveRepository from "../repositories/archive.repository";
import userReposirtory from "../repositories/user.reposirtory";


/**
 * @name createArchive
 * @description Creates a new archive
 * @route POST /archives
 * @access Private
 */
export const createArchive = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      title,
      image,
      excerpt,
      description,
      link,
      content,
      author,
      category,
      tags,
      type,
      user
    }: CreateArchiveDTO = req.body;

    const validate = await validationService.validateCreateArchive(req.body);
    if (validate.error) {
      return next(new ErrorResponse("Error", 400, [validate.message]));
    }

    const data = {
      title,
      image,
      excerpt,
      description,
      link,
      content,
      author,
      category,
      tags,
      type,
      user
    };

    const archive = await archiveRepository.createArchive(data);

    res.status(200).json({
      error: false,
      errors: [],
      data: archive,
      message: "Archive created successfully.",
      status: 200
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
    const {
      title,
      image,
      excerpt,
      description,
      link,
      content,
      author,
      category,
      tags,
      type,
      user
    }: UpdateArchiveDTO = req.body;

    const validate = await validationService.validateUpdateArchive(req.body);
    if (validate.error) {
      return next(new ErrorResponse("Error", 400, [validate.message]));
    }

    const data = {
      title,
      image,
      excerpt,
      description,
      link,
      content,
      author,
      category,
      tags,
      type,
      user
    };

    const { id } = req.params;
    const result = await archiveRepository.updateArchive(id, data);

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

/**
 * @name getArchiveById
 * @description Get archive by ID
 * @route GET /archives/:id
 * @access Public
 */
export const getArchiveById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const archive = await archiveRepository.findById(id, true);

    if (!archive) {
      return next(new ErrorResponse("Error", 404, ["Archive not found"]));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: archive,
      message: "Archive fetched successfully.",
      status: 200
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

    const user = await userReposirtory.findById(userId);
    if (!user) {
      return next(new ErrorResponse("Error", 404, ["User not found"]));
    }

    const result = await archiveRepository.getUserArchives(user._id);

    res.status(200).json({
      error: false,
      errors: [],
      data: result.data,
      message: "User archives fetched successfully.",
      status: 200
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
