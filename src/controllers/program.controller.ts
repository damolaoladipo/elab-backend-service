import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import programRepository from "../repositories/program.repository";
import uploadService from "../services/upload.service";
import { CreateProgramDTO, UpdateProgramDTO } from "../dtos/program.dto";
import { IProgramDoc } from "../utils/interface.util";
import { generateSlug } from "../utils/helper.util";
import userRepository from "../repositories/user.repository";

/**
 * @name createProgram
 * @route POST /programs
 * @access Private
 */
export const createProgram = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    
    const userId = (req as any).user?.id;
    if (!userId) return next(new ErrorResponse("Unauthorized", 401, []));

    const {
      title,
      slug,
      image,
      description,
      joinUrl,
      partnerUrl,
    }: CreateProgramDTO = req.body;

    const data = {
      title,
      slug,
      image,
      description,
      joinUrl,
      partnerUrl,
    };

    const program = await programRepository.createProgram(data);
    if (program.error) {
      return next(new ErrorResponse(program.message, program.code!, []));
    }

    const imageFile = (req as any).files?.find(
      (f: any) => f.fieldname === "image"
    );

    if (imageFile) {
      const imageUrl = await uploadService.uploadFile({
        stream: imageFile.stream,
        mimeType: imageFile.mimeType,
        originalFileName: imageFile.fileName,
        refId: program.data._id,
      });

      if (imageUrl && imageUrl !== program.data.image) {
        await programRepository.updateProgram(program.data._id, {
          image: imageUrl,
        });
        program.data.image = imageUrl;
      }
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: {
        id: program.data._id,
        title: program.data.title,
        slug: program.data.slug,
        description: program.data.description,
        image: program.data.image,
        joinUrl: program.data.joinUrl,
        partnerUrl: program.data.partnerUrl,
      },
      message: "Program created successfully.",
      status: 200,
    });
  }
);

/**
 * @name updateProgram
 * @route PUT /programs/:id
 * @access Private
 */
export const updateProgram = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    
    const userId = (req as any).user?.id;
    if (!userId) return next(new ErrorResponse("Unauthorized", 401, []));

    const programId = req.params.id;
    if (!programId)
      return next(new ErrorResponse("Program ID is required", 400, []));

    const {
      title,
      slug,
      image,
      description,
      joinUrl,
      partnerUrl,
    }: UpdateProgramDTO = req.body;

    const imageFile = (req as any).files?.find(
      (f: any) => f.fieldname === "image"
    );

    const hasBodyUpdate =
      title || slug || image || description || joinUrl || partnerUrl;
    const hasFileUpdate = !!imageFile;

    if (!hasBodyUpdate && !hasFileUpdate) {
      return next(new ErrorResponse("Update data is empty", 400, []));
    }

    const found = await programRepository.findProgram(programId);
    if (found.error) {
      return next(new ErrorResponse(found.message, 404, []));
    }

    const updatePayload: Partial<IProgramDoc> = {};

    if (title && title !== found.data.title) {
      updatePayload.title = title;

      const generatedSlug = await generateSlug({
        input: title,
        slugExistsFn: programRepository.slugExists.bind(programRepository),
      });

      updatePayload.slug = generatedSlug;
    }

    if (slug && slug !== found.data.slug) {
      updatePayload.slug = slug;
    }

    if (
      description &&
      JSON.stringify(description) !== JSON.stringify(found.data.description)
    ) {
      updatePayload.description = description;
    }

    if (joinUrl && joinUrl !== found.data.joinUrl) {
      updatePayload.joinUrl = joinUrl;
    }

    if (partnerUrl && partnerUrl !== found.data.partnerUrl) {
      updatePayload.partnerUrl = partnerUrl;
    }

    if (image && image !== found.data.image) {
      updatePayload.image = image;
    }

    if (imageFile) {
      const imageUrl = await uploadService.uploadFile({
        stream: imageFile.stream,
        mimeType: imageFile.mimeType,
        originalFileName: imageFile.fileName,
        refId: found.data._id,
      });

      if (imageUrl && imageUrl !== found.data.image) {
        updatePayload.image = imageUrl;
      }
    }

    const result = await programRepository.updateProgram(
      programId,
      updatePayload
    );
    if (result.error) {
      return next(new ErrorResponse(result.message, result.code!, []));
    }

    res.status(200).json({
      error: false,
      message: "Program updated successfully.",
      data: result.data,
    });
  }
);


/**
 * @name getProgram
 * @route GET /programs/:slug
 * @access Public
 */
export const getProgram = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;

    const result = await programRepository.findProgram(slug);
    if (result.error || !result.data) {
      return next(new ErrorResponse("Program not found", result.code, []));
    }

    const program = result.data as IProgramDoc;

    res.status(200).json({
      error: false,
      errors: [],
      data: {
        id: program._id,
        title: program.title,
        slug: program.slug,
        description: program.description,
        image: program.image,
        joinUrl: program.joinUrl,
        partnerUrl: program.partnerUrl,
      },
      message: "Program fetched successfully.",
      status: 200,
    });
  }
);

/**
 * @name getPrograms
 * @route GET /programs
 * @access Public
 */
export const getPrograms = asyncHandler(
  async (_req: Request, res: Response) => {
    const result = await programRepository.getPrograms();

    res.status(200).json({
      error: false,
      errors: [],
      data: {
        programs: result.data.map((program: IProgramDoc) => ({
          id: program._id,
          title: program.title,
          slug: program.slug,
          description: program.description,
          image: program.image,
          joinUrl: program.joinUrl,
          partnerUrl: program.partnerUrl,
        })),
      },
      message: "Programs fetched successfully.",
      status: 200,
    });
  }
);

/**
 * @name getUserPrograms
 * @description Get all programs for a specific user
 * @route GET /users/:userId/programs
 * @access Public
 */
export const getUserPrograms = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    if (!userId) {
      return next(new ErrorResponse("Unauthorized", 401, []));
    }

    const user = await userRepository.findUser(userId);
    if (user.error) {
      return next(new ErrorResponse(user.message, user.code, []));
    }

    const result = await programRepository.getUserPrograms(userId);

    if (result.error) {
      return next(new ErrorResponse(result.message, result.code, []));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: result.data.map((program: IProgramDoc) => ({
        id: program._id,
        title: program.title,
        slug: program.slug,
        description: program.description,
        image: program.image,

      })),
      message: "User programs fetched successfully",
      status: 200,
    });
  }
);


/**
 * @name deleteProgram
 * @route DELETE /programs/:id
 * @access Private
 */
export const deleteProgram = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const program = await programRepository.findProgram(id);
    if (program.error) {
      return next(new ErrorResponse(program.message, program.code, []));
    }

    const result = await programRepository.deleteProgram(id);
    if (result.error) {
      return next(new ErrorResponse(result.message, result.code!, []));
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
