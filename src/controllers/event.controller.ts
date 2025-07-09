import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import validationService from "../services/validate.service";
import eventRepository from "../repositories/event.repository";
import userRepository from "../repositories/user.repository";
import uploadService from "../services/upload.service";
import { CreateEventDTO, UpdateEventDTO } from "../dtos/event.dto";
import { IEventDoc } from "../utils/interface.util";
import Event from "../models/Event.model";
import slugify from "slugify";

/**
 * @name createEvent
 * @description Creates a new event
 * @route POST /events
 * @access Private
 */
export const createEvent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    if (!userId) {
      return next(new ErrorResponse("Unauthorized", 401, []));
    }

    const {
      title,
      content,
      features,
      joinUrl,
      planUrl,
      sponsorUrl,
      communityUrl,
    }: CreateEventDTO = req.body;

    const validate = await validationService.validateCreateEvent(req.body);
    if (validate.error) {
      return next(new ErrorResponse(validate.message, 400, []));
    }

    const data = {
      title,
      image: "",
      content,
      features,
      joinUrl,
      planUrl,
      sponsorUrl,
      communityUrl,
      user: userId,
    };

    const event = await eventRepository.createEvent(data);
    if (event.error) {
      return next(new ErrorResponse(event.message, event.code!, []));
    }

    const imageFile = (req as any).files.find(
      (f: any) => f.fieldname === "image"
    );

    let imageUrl = "";

    if (
      imageFile &&
      imageFile.stream &&
      imageFile.mimeType &&
      imageFile.fileName
    ) {
      const ImageData = {
        stream: imageFile.stream,
        mimeType: imageFile.mimeType,
        originalFileName: imageFile.fileName,
        refId: event.data._id,
      };

      imageUrl = await uploadService.uploadFile(ImageData);

      if (imageUrl && imageUrl !== event.data.image) {
        await eventRepository.updateEvent(event.data._id, { image: imageUrl });
        event.data.image = imageUrl;
      }
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: {
        title: event.data.title,
        slug: event.data.slug,
        image: event.data.image,
        content: event.data.content,
        features: event.data.features,
        joinUrl: event.data.joinUrl,
        planUrl: event.data.planUrl,
        sponsorUrl: event.data.sponsorUrl,
        communityUrl: event.data.communityUrl,
        id: event.data._id,
      },
      message: "Event created successfully.",
      status: 200,
    });
  }
);

/**
 * @name updateEvent
 * @description Update an event
 * @route PATCH /events/:id
 * @access Private
 */
export const updateEvent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    const eventId = req.params.id;

    if (!userId) {
      return next(new ErrorResponse("Unauthorized", 401, []));
    }

    const {
      title,
      content,
      features,
      joinUrl,
      planUrl,
      sponsorUrl,
      communityUrl,
    }: Partial<CreateEventDTO> = req.body;

    
    const validate = await validationService.validateUpdateEvent(req.body);
    if (validate.error) {
      return next(new ErrorResponse(validate.message, 400, []));
    }

    const data: Partial<IEventDoc> = {
      ...(title && { title }),
      ...(content && { content }),
      ...(features && { features }),
      ...(joinUrl && { joinUrl }),
      ...(planUrl && { planUrl }),
      ...(sponsorUrl && { sponsorUrl }),
      ...(communityUrl && { communityUrl }),
    };

    const updatedEvent = await eventRepository.updateEvent(eventId, data);
    if (updatedEvent.error) {
      return next(
        new ErrorResponse(updatedEvent.message, updatedEvent.code!, [])
      );
    }

    const imageFile = (req as any).files?.find(
      (f: any) => f.fieldname === "image"
    );

    if (
      imageFile &&
      imageFile.stream &&
      imageFile.mimeType &&
      imageFile.fileName
    ) {
      const ImageData = {
        stream: imageFile.stream,
        mimeType: imageFile.mimeType,
        originalFileName: imageFile.fileName,
        refId: updatedEvent.data._id,
      };

      const imageUrl = await uploadService.uploadFile(ImageData);

      if (imageUrl && imageUrl !== updatedEvent.data.image) {
        await eventRepository.updateEvent(eventId, { image: imageUrl });
        updatedEvent.data.image = imageUrl;
      }
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: {
        title: updatedEvent.data.title,
        slug: updatedEvent.data.slug,
        image: updatedEvent.data.image,
        content: updatedEvent.data.content,
        features: updatedEvent.data.features,
        joinUrl: updatedEvent.data.joinUrl,
        planUrl: updatedEvent.data.planUrl,
        sponsorUrl: updatedEvent.data.sponsorUrl,
        communityUrl: updatedEvent.data.communityUrl,
        id: updatedEvent.data._id,
      },
      message: "Event updated successfully.",
      status: 200,
    });
  }
);

/**
 * @name getEvent
 * @description Get event by slug
 * @param {string} slug OR Id - The slug or ID of the event
 * @route GET /events/slug/:slug
 * @access Public
 */
export const getEvent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;

    const result = await eventRepository.findEvent(slug);

    if (result.error || !result.data) {
      return next(new ErrorResponse("Event not found", result.code, []));
    }

    const event = result.data as IEventDoc;

    res.status(200).json({
      error: false,
      errors: [],
      data: {
        title: event.title,
        slug: event.slug,
        content: event.content,
        image: event.image,
        features: event.features,
        joinUrl: event.joinUrl,
        planUrl: event.planUrl,
        sponsorUrl: event.sponsorUrl,
        communityUrl: event.communityUrl,
        id: event._id,
      },
      message: "Event fetched successfully.",
      status: 200,
    });
  }
);

/**
 * @name getUserEvents
 * @description Get all events for a specific user
 * @route GET /users/:userId/events
 * @access Public
 */
export const getUserEvents = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    if (!userId) {
      return next(new ErrorResponse("Unauthorized", 401, []));
    }

    const user = await userRepository.findUser(userId);
    if (user.error) {
      return next(new ErrorResponse(user.message, user.code, []));
    }

    // Fetch user events with populated user data
    const result = await eventRepository.getUserEvents(userId);

    if (result.error) {
      return next(new ErrorResponse(result.message, result.code, []));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: result.data.map((event: IEventDoc) => ({
        id: event._id,
        title: event.title,
        slug: event.slug,
        content: event.content,
        image: event.image,
        features: event.features,
        joinUrl: event.joinUrl,
        planUrl: event.planUrl,
        sponsorUrl: event.sponsorUrl,
        communityUrl: event.communityUrl,
        user: event.user,
      })),
      message: "User events fetched successfully",
      status: 200,
    });
  }
);

/**
 * @name getEvents
 * @description Get all events
 * @route GET /events
 * @access Public
 */
export const getEvents = asyncHandler(async (_req: Request, res: Response) => {
  const result = await eventRepository.getEvents();

  res.status(200).json({
    error: false,
    errors: [],
    data: {
      events: result.data.map((event: IEventDoc) => ({
        title: event.title,
        slug: event.slug,
        content: event.content,
        image: event.image,
        features: event.features,
        joinUrl: event.joinUrl,
        planUrl: event.planUrl,
        sponsorUrl: event.sponsorUrl,
        communityUrl: event.communityUrl,
        id: event._id,
      })),
    },
    message: "Events fetched successfully.",
    status: 200,
  });
});

/**
 * @name deleteEvent
 * @description Deletes an event
 * @route DELETE /events/:id
 * @access Private
 */
export const deleteEvent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const event = await eventRepository.findEvent(id);
    if (event.error) {
      return next(new ErrorResponse(event.message, event.code, []));
    }

    const result = await eventRepository.deleteEvent(id);

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
