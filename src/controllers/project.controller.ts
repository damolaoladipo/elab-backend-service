import asyncHandler from "../middlewares/async.mdw";
import Project from "../models/Project.model";
import validationService from "../services/validate.service";
import ErrorResponse from "../utils/error.util";

/**
 * @name createProject
 * @description Creates a new project
 * @route POST /projects
 * @access Private
 */
export const createProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validate = await validationService.validateCreateProject(req.body);
    if (validate.error) {
      return next(new ErrorResponse("Error", 400, [validate.message]));
    }

    const project = await Project.create(req.body);

    res.status(201).json({
      error: false,
      errors: [],
      data: project,
      message: "Project created successfully.",
      status: 201,
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
    const validate = await validationService.validateUpdateProject(req.body);
    if (validate.error) {
      return next(new ErrorResponse("Error", 400, [validate.message]));
    }

    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!project) {
      return next(new ErrorResponse("Error", 404, ["Project not found"]));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: project,
      message: "Project updated successfully.",
      status: 200,
    });
  }
);
