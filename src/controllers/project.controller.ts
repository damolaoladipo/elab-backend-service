import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import validationService from "../services/validate.service";
import { CreateProjectDTO, UpdateProjectDTO } from "../dtos/project.dto";
import projectRepository from "../repositories/project.repository";
import userReposirtory from "../repositories/user.repository";
import uploadService from "../services/upload.service";
import { IProjectDoc } from "../utils/interface.util";



/**
 * @name createProject
 * @description Creates a new project
 * @route POST /projects
 * @access Private
 */

export const createProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    
    const userId = (req as any).user?.id;
    if (!userId) {
      return next(new ErrorResponse("Unauthorized", 401, ["Unauthorized user"]));
    }

    const {
      title,
      content,
      websiteUrl,
      volunteerUrl,
      partnerUrl,
      sponsorUrl,
    }: CreateProjectDTO = req.body;

    const validate = await validationService.validateCreateProject(req.body);
    if (validate.error) {
      return next(new ErrorResponse("Error", 400, [validate.message]));
    }

    const data = {
      title,
      image: "",
      content,
      websiteUrl,
      volunteerUrl,
      partnerUrl,
      sponsorUrl,
      user: userId,
    };

    const project = await projectRepository.createProject(data);
    if (project.error) {
      return next(new ErrorResponse("Error", project.code!, [project.message]));
    }

    const imageFile = (req as any).files.find(
      (f: any) => f.fieldname === "file" || f.fieldname === "image"
    );

    let imageUrl = "";

    if (imageFile) {
      const ImageData = {
        stream: imageFile.stream,
        mimeType: imageFile.mimeType,
        originalFileName: imageFile.fileName,
        refId: project.data._id,
      };

      imageUrl = await uploadService.uploadFile(ImageData);
    }

    if (imageUrl && imageUrl !== project.data.image) {
      await projectRepository.updateProject(project.data._id, { image: imageUrl });
      project.data.image = imageUrl;
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: {
        id: project.data._id,
        title: project.data.title,
        content: project.data.content,
        image: project.data.image,
        websiteUrl: project.data.websiteUrl,
        volunteerUrl: project.data.volunteerUrl,
        partnerUrl: project.data.partnerUrl,
        sponsorUrl: project.data.sponsorUrl,
      },
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
    const projectId = req.params.id;

    const {
      title,
      content,
      websiteUrl,
      volunteerUrl,
      partnerUrl,
      sponsorUrl,
    }: UpdateProjectDTO = req.body;

    // Validate input
    const validate = await validationService.validateUpdateProject(req.body);
    if (validate.error) {
      return next(new ErrorResponse("Validation Error", 400, [validate.message]));
    }

    // Get current project
    const existingProject = await projectRepository.findById(projectId);
    if (!existingProject) {
      return next(new ErrorResponse("Project not found", 404, ["Project not found"]));
    }

    // Handle image upload if present
    let imageUrl = existingProject.image;
    const imageFile = (req as any).files?.find(
      (f: any) => f.fieldname === "file" || f.fieldname === "image"
    );

    if (imageFile) {
      imageUrl = await uploadService.uploadFile({
        stream: imageFile.stream,
        mimeType: imageFile.mimeType,
        originalFileName: imageFile.fileName,
        refId: existingProject._id.toString(),
      });
    }

    // Update project
    const updated = await projectRepository.updateProject(projectId, {
      title,
      content,
      websiteUrl,
      volunteerUrl,
      partnerUrl,
      sponsorUrl,
      image: imageUrl,
    });

    if (updated.error) {
      return next(new ErrorResponse("Update failed", 500, [updated.message]));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: updated.data,
      message: "Project updated successfully.",
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
 * @name getProjectBySlug
 * @description Get a project by its slug
 * @route GET /projects/slug/:slug
 * @access Public
 */
export const getProjectBySlug = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;

    const result = await projectRepository.findBySlug(slug);
    if (result.error || !result.data) {
      return next(new ErrorResponse("Project not found", 404, [result.message]));
    }

    const project = result.data as IProjectDoc;

    res.status(200).json({
      error: false,
      errors: [],
      data: {
        id: project._id,
        title: project.title,
        content: project.content,
        image: project.image,
        websiteUrl: project.websiteUrl,
        volunteerUrl: project.volunteerUrl,
        partnerUrl: project.partnerUrl,
        sponsorUrl: project.sponsorUrl,
        slug: project.slug,
      },
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

    const result = await projectRepository.getUserProjects(userId);

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
