import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import validationService from "../services/validate.service";
import { CreateResourceDTO, UpdateResourceDTO } from "../dtos/resource.dto";
import resourceRepository from "../repositories/resource.repository";
import userReposirtory from "../repositories/user.repository";


/**
 * @name createResource
 * @description Creates a new resource
 * @route POST /resources
 * @access Private
 */
export const createResource = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      title,
      image,
      description,
      resource,
      type,
      author,
      category,
      tags,
      user
    }: CreateResourceDTO = req.body;

    const validate = await validationService.validateCreateResource(req.body);
    if (validate.error) {
      return next(new ErrorResponse("Error", 400, [validate.message]));
    }

    const data = {
      title,
      image,
      description,
      resource,
      type,
      author,
      category,
      tags,
      user
    };

    const result = await resourceRepository.createResource(data);

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
 * @name updateResource
 * @description Updates a resource
 * @route PATCH /resources/:id
 * @access Private
 */
export const updateResource = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      title,
      image,
      description,
      resource,
      type,
      author,
      category,
      tags,
      user
    }: UpdateResourceDTO = req.body;

    const validate = await validationService.validateUpdateResource(req.body);
    if (validate.error) {
      return next(new ErrorResponse("Error", 400, [validate.message]));
    }

    const data = {
      title,
      image,
      description,
      resource,
      type,
      author,
      category,
      tags,
      user
    };

    const { id } = req.params;
    const result = await resourceRepository.updateResource(id, data);

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
 * @name getResourceById
 * @description Get resource by ID
 * @route GET /resources/:id
 * @access Public
 */
export const getResourceById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const resource = await resourceRepository.findById(id, true);

    if (!resource) {
      return next(new ErrorResponse("Error", 404, ["Resource not found"]));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: resource,
      message: "Resource fetched successfully.",
      status: 200
    });
  }
);

/**
 * @name getUserResources
 * @description Get all resources for a specific user
 * @route GET /users/:userId/resources
 * @access Public
 */
export const getUserResources = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    const user = await userReposirtory.findById(userId);
    if (!user) {
      return next(new ErrorResponse("Error", 404, ["User not found"]));
    }

    const result = await resourceRepository.getUserResources(user._id);

    res.status(200).json({
      error: false,
      errors: [],
      data: result.data,
      message: "User resources fetched successfully.",
      status: 200
    });
  }
);

/**
 * @name getResources
 * @description Get all resources
 * @route GET /resources
 * @access Public
 */
export const getResources = asyncHandler(
  async (_req: Request, res: Response) => {
    const result = await resourceRepository.getResources();

    res.status(200).json({
      error: false,
      errors: [],
      data: result.data,
      message: "Resources fetched successfully.",
      status: 200
    });
  }
);

/**
 * @name deleteResource
 * @description Deletes a resource
 * @route DELETE /resources/:id
 * @access Private
 */
export const deleteResource = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const resource = await resourceRepository.findById(id);
    if (!resource) {
      return next(new ErrorResponse("Error", 404, ["Resource not found"]));
    }

    const result = await resourceRepository.deleteResource(id);

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
