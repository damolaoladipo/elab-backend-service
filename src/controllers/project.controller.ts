import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import validationService from "../services/validate.service";
import { CreateProjectDTO, UpdateProjectDTO } from "../dtos/project.dto";
import projectRepository from "../repositories/project.repository";
import userReposirtory from "../repositories/user.reposirtory";


/**
 * @name createProject
 * @description Creates a new project
 * @route POST /projects
 * @access Private
 */
export const createProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      image,
      description,
      startDate,
      user,
    }: CreateProjectDTO = req.body;

    const validate = await validationService.validateCreateProject(req.body);
    if (validate.error) {
      return next(new ErrorResponse("Error", 400, [validate.message]));
    }

    const data = {
      name,
      image,
      description,
      startDate,
      user,
    };

    const project = await projectRepository.createProject(data);

    res.status(200).json({
      error: false,
      errors: [],
      data: project,
      message: "Project created successfully.",
      status: 200,
    });
  }
);

/**
 * @name updateProject
 * @description Updates a project
 * @route PATCH /projects/:id
 * @access Private
 */
export const updateProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      image,
      description,
      startDate,
      user,
    }: UpdateProjectDTO = req.body;

    const validate = await validationService.validateUpdateProject(req.body);
    if (validate.error) {
      return next(new ErrorResponse("Error", 400, [validate.message]));
    }

    const data = {
      name,
      image,
      description,
      startDate,
      user,
    };

    const { id } = req.params;
    const result = await projectRepository.updateProject(id, data);

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

/**
 * @name getProjectById
 * @description Get project by ID
 * @route GET /projects/:id
 * @access Public
 */
export const getProjectById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const project = await projectRepository.findById(id, true);

    if (!project) {
      return next(new ErrorResponse("Error", 404, ["Project not found"]));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: project,
      message: "Project fetched successfully.",
      status: 200,
    });
  }
);

/**
 * @name getUserProjects
 * @description Get all projects for a specific user
 * @route GET /users/:userId/projects
 * @access Public
 */
export const getUserProjects = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    const user = await userReposirtory.findById(userId);
    if (!user) {
      return next(new ErrorResponse("Error", 404, ["User not found"]));
    }

    const result = await projectRepository.getUserProjects(user._id);

    res.status(200).json({
      error: false,
      errors: [],
      data: result.data,
      message: "User projects fetched successfully.",
      status: 200,
    });
  }
);

/**
 * @name getProjects
 * @description Get all projects
 * @route GET /projects
 * @access Public
 */
export const getProjects = asyncHandler(
  async (_req: Request, res: Response) => {
    
    const result = await projectRepository.getProjects();

    res.status(200).json({
      error: false,
      errors: [],
      data: result.data,
      message: "Projects fetched successfully.",
      status: 200,
    });
  }
);

/**
 * @name deleteProject
 * @description Deletes a project
 * @route DELETE /projects/:id
 * @access Private
 */
export const deleteProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const project = await projectRepository.findById(id);
    if (!project) {
      return next(new ErrorResponse("Error", 404, ["Project not found"]));
    }

    const result = await projectRepository.deleteProject(id);

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
