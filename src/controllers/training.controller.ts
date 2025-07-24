import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import validationService from "../services/validate.service";
import trainingRepository from "../repositories/training.repository";
import uploadService from "../services/upload.service";
import { ITrainingDoc } from "../utils/interface.util";
import { CreateTrainingDTO, UpdateTrainingDTO } from "../dtos/training.dto";
import { generateSlug } from "../utils/helper.util";
import userRepository from "../repositories/user.repository";

/**
 * @name createTraining
 * @route POST /trainings
 * @access Private
 */
export const createTraining = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    if (!userId) return next(new ErrorResponse("Unauthorized User", 401, []));

    const {
      title,
      subtitle,
      image,
      description,
      outcome,
      cta,
    }: CreateTrainingDTO = req.body;

    const data: Partial<ITrainingDoc> = {
      title,
      subtitle,
      image: image || "",
      description,
      outcome,
      cta,
      user: userId,
    };

    const training = await trainingRepository.createTraining(data);
    if (training.error) {
      return next(new ErrorResponse(training.message, training.code!, []));
    }

    // handle image upload
    const imageFile = (req as any).files?.find((f: any) => f.fieldname === "image");
    if (imageFile) {
      const imageUrl = await uploadService.uploadFile({
        stream: imageFile.stream,
        mimeType: imageFile.mimeType,
        originalFileName: imageFile.fileName,
        refId: training.data._id,
      });
      if (imageUrl && imageUrl !== training.data.image) {
        await trainingRepository.updateTraining(training.data._id, { image: imageUrl });
        training.data.image = imageUrl;
      }
    }

    res.status(201).json({
      error: false,
      errors: [],
      data: {
        id: training.data._id,
        title: training.data.title,
        slug: training.data.slug,
        subtitle: training.data.subtitle,
        image: training.data.image,
        description: training.data.description,
        outcome: training.data.outcome,
        cta: training.data.cta,
      },
      message: "Training created successfully.",
      status: 201,
    });
  }
);

/**
 * @name updateTraining
 * @route PUT /trainings/:id
 * @access Private
 */
export const updateTraining = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    if (!userId) return next(new ErrorResponse("Unauthorized", 401, []));

    const trainingId = req.params.trainingId;
    console.log("params:", req.params);
    if (!trainingId) return next(new ErrorResponse("Training ID is required", 400, []));

    const {
      title,
      slug,
      subtitle,
      image,
      description,
      outcome,
      cta,
    }: UpdateTrainingDTO = req.body;

    const imageFile = (req as any).files?.find((f: any) => f.fieldname === "image");

    const hasBodyUpdate =
      title || slug || subtitle || image || description || outcome || cta;
    const hasFileUpdate = !!imageFile;

    if (!hasBodyUpdate && !hasFileUpdate) {
      return next(new ErrorResponse("Update data is empty", 400, []));
    }

    const found = await trainingRepository.findTraining(trainingId);
    if (found.error) {
      return next(new ErrorResponse(found.message, 404, []));
    }

    const current = found.data as ITrainingDoc;
    const updatePayload: Partial<ITrainingDoc> = {};

    if (title && title !== current.title) {
      updatePayload.title = title;
      updatePayload.slug = await generateSlug({
        input: title,
        slugExistsFn: trainingRepository.slugExists.bind(trainingRepository),
      });
    } else if (slug && slug !== current.slug) {
      updatePayload.slug = slug;
    }

    if (subtitle && subtitle !== current.subtitle) updatePayload.subtitle = subtitle;
    if (description && JSON.stringify(description) !== JSON.stringify(current.description))
      updatePayload.description = description;
    if (outcome && JSON.stringify(outcome) !== JSON.stringify(current.outcome))
      updatePayload.outcome = outcome;
    if (cta && cta !== current.cta) updatePayload.cta = cta;
    if (image && image !== current.image) updatePayload.image = image;

    if (imageFile) {
      const imageUrl = await uploadService.uploadFile({
        stream: imageFile.stream,
        mimeType: imageFile.mimeType,
        originalFileName: imageFile.fileName,
        refId: found.data._id,
      });
      if (imageUrl && imageUrl !== current.image) {
        updatePayload.image = imageUrl;
      }
    }

    const updated = await trainingRepository.updateTraining(trainingId, updatePayload);
    if (updated.error) {
      return next(new ErrorResponse(updated.message, updated.code!, []));
    }

    res.status(200).json({
      error: false,
      message: "Training updated successfully.",
      data: updated.data,
    });
  }
);

/**
 * @name getUserTrainings
 * @description Get all trainings for a specific user
 * @route GET /trainings/user/:userId
 * @access Public
 */
export const getUserTrainings = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    if (!userId) {
      return next(new ErrorResponse("Unauthorized", 401, []));
    }

    const user = await userRepository.findUser(userId);
    if (user.error) {
      return next(new ErrorResponse(user.message, user.code, []));
    }

    const result = await trainingRepository.getUserTrainings(userId);

    if (result.error) {
      return next(new ErrorResponse(result.message, result.code, []));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: result.data.map((training: ITrainingDoc) => ({
         id: training._id,
        title: training.title,
        slug: training.slug,
        subtitle: training.subtitle,
        image: training.image,
        description: training.description,
        outcome: training.outcome,
        cta: training.cta,

      })),
      message: "User trainings fetched successfully",
      status: 200,
    });
  }
);


/**
 * @name getTraining
 * @route GET /trainings/:slug
 * @access Public
 */
export const getTraining = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;
    const result = await trainingRepository.findTraining(slug);
    if (result.error || !result.data) {
      return next(new ErrorResponse("Training not found", result.code, []));
    }
    const t = result.data as ITrainingDoc;
    res.status(200).json({
      error: false,
      errors: [],
      data: {
        id: t._id,
        title: t.title,
        slug: t.slug,
        subtitle: t.subtitle,
        image: t.image,
        description: t.description,
        outcome: t.outcome,
        cta: t.cta,
      },
      message: "Training fetched successfully.",
      status: 200,
    });
  }
);

/**
 * @name getTrainings
 * @route GET /trainings
 * @access Public
 */
export const getTrainings = asyncHandler(async (_req: Request, res: Response) => {
  const result = await trainingRepository.getTrainings();
  res.status(200).json({
    error: false,
    errors: [],
    data: {
      trainings: (result.data as ITrainingDoc[]).map((t) => ({
        id: t._id,
        title: t.title,
        slug: t.slug,
        subtitle: t.subtitle,
        image: t.image,
        description: t.description,
        outcome: t.outcome,
        cta: t.cta,
      })),
    },
    message: "Trainings fetched successfully.",
    status: 200,
  });
});

/**
 * @name deleteTraining
 * @route DELETE /trainings/:id
 * @access Private
 */
export const deleteTraining = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const trainingId = req.params.trainingId;
    const existing = await trainingRepository.findTraining(trainingId);
    if (existing.error) {
      return next(new ErrorResponse(existing.message, existing.code, []));
    }
    const deleted = await trainingRepository.deleteTraining(trainingId);
    if (deleted.error) {
      return next(new ErrorResponse(deleted.message, deleted.code!, []));
    }
    res.status(200).json({
      error: false,
      errors: [],
      data: deleted.data,
      message: "Training deleted successfully.",
      status: 200,
    });
  }
);
