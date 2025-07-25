import { Request, Response, NextFunction } from "express";
import storeRepository from "../repositories/store.repository";
import { CreateStoreDTO, UpdateStoreDTO } from "../dtos/store.dto";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import uploadService from "../services/upload.service";
import { IStoreDoc } from "../utils/interface.util";
import { generateSlug } from "../utils/helper.util";

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
      discount,
      category,
      author,
      excerpt,
      description,
      url,
      color,
      pageCount,
      size,
      status,
    }: CreateStoreDTO = req.body;

    const parsedColor = typeof color === "string" ? JSON.parse(color) : color;
    const parsedSize = typeof size === "string" ? JSON.parse(size) : size;

    const discountedPrice = discount ? price - (price * discount) / 100 : price;

    const data = {
      name,
      price,
      discount,
      discountedPrice,
      category,
      author,
      excerpt,
      description,
      url,
      color: parsedColor || [],
      pageCount,
      size: parsedSize || {},
      status,
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

    const store = await storeRepository.findStore(storeId);
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

    const store = await storeRepository.findStore(storeId);
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
    const userId = (req as any).user?.id;

    if (!userId) {
      return next(new ErrorResponse("Unauthorized", 401, []));
    }

    const storeId = req.params.id;
    if (!storeId) {
      return next(new ErrorResponse("Store ID is required", 400, []));
    }

    const {
      name,
      price,
      discount,
      category,
      author,
      excerpt,
      description,
      url,
      color,
      pageCount,
      size,
      status,
    }: UpdateStoreDTO = req.body;

    const parsedColor = typeof color === "string" ? JSON.parse(color) : color;
    const parsedSize = typeof size === "string" ? JSON.parse(size) : size;

    const imageFile = (req as any).files?.find(
      (file: any) => file.fieldname === "image"
    );

    const hasBodyUpdate =
      name ||
      price !== undefined ||
      discount !== undefined ||
      category ||
      author ||
      excerpt ||
      description ||
      url ||
      parsedColor ||
      pageCount ||
      parsedSize ||
      status;

    const hasFileUpdate = !!imageFile;

    if (!hasBodyUpdate && !hasFileUpdate) {
      return next(new ErrorResponse("Update data is empty", 400, []));
    }

    const existing = await storeRepository.findStore(storeId);
    if (existing.error) {
      return next(new ErrorResponse(existing.message, existing.code, []));
    }

    const updatePayload: Partial<IStoreDoc> = {};

    if (name && name !== existing.data.name) {
      updatePayload.name = name;
      const slug = await generateSlug({
        input: name,
        slugExistsFn: storeRepository.slugExists.bind(storeRepository),
      });
      updatePayload.slug = slug;
    }

    const isPriceChanged = price !== undefined && price !== existing.data.price;
    if (isPriceChanged) updatePayload.price = price;

    const isDiscountChanged =
      discount !== undefined && discount !== existing.data.discount;
    if (isDiscountChanged) updatePayload.discount = discount;

    const finalPrice = price !== undefined ? price : existing.data.price;
    const finalDiscount =
      discount !== undefined
        ? discount
        : existing.data.discount !== undefined
        ? existing.data.discount
        : 0;

    updatePayload.discountedPrice = finalDiscount
      ? finalPrice - (finalPrice * finalDiscount) / 100
      : finalPrice;

    if (category && category !== existing.data.category) {
      updatePayload.category = category;
    }

    if (author && author !== existing.data.author) {
      updatePayload.author = author;
    }

    if (excerpt && excerpt !== existing.data.excerpt) {
      updatePayload.excerpt = excerpt;
    }

    if (description && description !== existing.data.description) {
      updatePayload.description = description;
    }

    if (url && url !== existing.data.url) {
      updatePayload.url = url;
    }

    if (parsedColor && JSON.stringify(parsedColor) !== JSON.stringify(existing.data.color)) {
      updatePayload.color = parsedColor;
    }

    if (pageCount && pageCount !== existing.data.pageCount) {
      updatePayload.pageCount = pageCount;
    }

    if (parsedSize && JSON.stringify(parsedSize) !== JSON.stringify(existing.data.size)) {
      updatePayload.size = parsedSize;
    }

    if (status && status !== existing.data.status) {
      updatePayload.status = status;
    }

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

    const updated = await storeRepository.updateStore(storeId, updatePayload);
    if (updated.error) {
      return next(new ErrorResponse(updated.message, updated.code, []));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: updated.data,
      message: "Store item updated successfully",
      status: 200,
    });
  }
);

/**
 * @name getStoreItemBySlug
 * @description Get store item by slug or ID
 * @param {string} slug - The slug of the store item
 * @route GET /store/slug/:slug
 * @access Public
 */
export const getStoreItem = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;

    const result = await storeRepository.findStore(slug);
    if (result.error || !result.data) {
      return next(
        new ErrorResponse("Store item not found", 404, [result.message])
      );
    }

    const item = result.data as IStoreDoc;

    res.status(200).json({
      error: false,
      errors: [],
      data: {
        id: item._id,
        name: item.name,
        slug: item.slug,
        price: item.price,
        discount: item.discount,
        discountedPrice: item.discountedPrice,
        image: item.image,
        category: item.category,
        excerpt: item.excerpt,
        description: item.description,
        author: item.author,
        url: item.url,
        color: item.color,
        pageCount: item.pageCount,
        size: item.size,
        status: item.status,
      },
      message: "Store item fetched successfully",
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
