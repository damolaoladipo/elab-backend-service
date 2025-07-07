import { Request, Response, NextFunction } from "express";
import storeRepository from "../repositories/store.repository";
import { CreateStoreDTO, UpdateStoreDTO } from "../dtos/store.dto";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import uploadService from "../services/upload.service";

/**
 * @name createStore
 * @description Create a new store item
 * @route POST /store
 * @access Private
 */
export const createStore = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;

    const {
      name,
      price,
      discountedPrice,
      tags,
      category,
      author,
      excerpt,
      description,
      url,
      status,
    }: CreateStoreDTO = req.body;

    const data = {
      name,
      price,
      discountedPrice,
      tags,
      category,
      author,
      excerpt,
      description,
      url,
      status: "draft",
      image: "",
      user: userId,
    };

    const result = await storeRepository.createStore(data);

    const imageFile = (req as any).files.find(
      (file: any) => file.fieldname === "image"
    );

    let imageUrl = "";

    if (imageFile) {
      imageUrl = await uploadService.uploadFile({
        stream: imageFile.stream,
        mimeType: imageFile.mimeType,
        originalFileName: imageFile.fileName,
        refId: result.data._id,
      });

      await storeRepository.updateStore(result.data._id, { image: imageUrl });
      result.data.image = imageUrl;
    }

    res.status(201).json({
      error: false,
      errors: [],
      data: result.data,
      message: "Store item created successfully",
      status: 201,
    });
  }
);

/**
 * @name publishStore
 * @description Publishes a store item
 * @route PATCH /store/:id/publish
 * @access Private
 */
export const publishStore = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const storeId = req.params.id;

    const store = await storeRepository.findById(storeId);
    if (store.error || !store.data) {
      return next(new ErrorResponse("Store item not found", 404, []));
    }

    if (store.data.status === "published") {
      return next(new ErrorResponse("Store item already published", 400, []));
    }

    const updated = await storeRepository.updateStore(storeId, {
      status: "published",
    });

    if (updated.error) {
      return next(new ErrorResponse("Failed to publish store item", 500, []));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: updated.data,
      message: "Store item published successfully.",
      status: 200,
    });
  }
);

/**
 * @name unpublishStore
 * @description Unpublishes a store item
 * @route PATCH /store/:id/unpublish
 * @access Private
 */
export const unpublishStore = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const storeId = req.params.id;

    const store = await storeRepository.findById(storeId);
    if (store.error || !store.data) {
      return next(new ErrorResponse("Store item not found", 404, []));
    }

    if (store.data.status === "draft") {
      return next(new ErrorResponse("Store item already unpublished", 400, []));
    }

    const updated = await storeRepository.updateStore(storeId, {
      status: "draft",
    });

    if (updated.error) {
      return next(new ErrorResponse("Failed to unpublish store item", 500, []));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: updated.data,
      message: "Store item unpublished successfully.",
      status: 200,
    });
  }
);

/**
 * @name updateStore
 * @description Update an existing store item
 * @route PATCH /store/:id
 * @access Private
 */
export const updateStore = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const storeId = req.params.id;
    const update: UpdateStoreDTO = req.body;

    const found = await storeRepository.findById(storeId);
    if (found.error) {
      return next(new ErrorResponse("Store item not found", 404, []));
    }

    const imageFile = (req as any).files.find(
      (file: any) => file.fieldname === "image"
      );

    if (imageFile) {
      const imageUrl = await uploadService.uploadFile({
        stream: imageFile.stream,
        mimeType: imageFile.mimeType,
        originalFileName: imageFile.fileName,
        refId: storeId,
      });
      update.image = imageUrl;
    }

    const result = await storeRepository.updateStore(storeId, update);
    if (result.error) {
      return next(new ErrorResponse(result.message, result.code!, []));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: result.data,
      message: "Store item updated successfully",
      status: 200,
    });
  }
);

/**
 * @name getStoreById
 * @description Get store item by ID
 * @route GET /store/:id
 * @access Public
 */
export const getStoreById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await storeRepository.findById(id);

    if (result.error) {
      return next(new ErrorResponse(result.message, result.code!, []));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: result.data,
      message: "Store item retrieved successfully",
      status: 200,
    });
  }
);

/**
 * @name getStores
 * @description Get all store items
 * @route GET /store
 * @access Public
 */
export const getStores = asyncHandler(async (_req: Request, res: Response) => {
  const result = await storeRepository.getStores();

  res.status(200).json({
    error: false,
    errors: [],
    data: result.data,
    message: "Store items retrieved",
    status: 200,
  });
});

/**
 * @name deleteStore
 * @description Delete a store item by ID
 * @route DELETE /store/:id
 * @access Private
 */
export const deleteStore = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await storeRepository.deleteStore(id);

    if (result.error) {
      return next(new ErrorResponse(result.message, result.code!, []));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: {},
      message: "Store item deleted",
      status: 200,
    });
  }
);
