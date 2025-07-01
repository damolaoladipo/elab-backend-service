import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import validationService from "../services/validate.service";
import { CreateEventDTO } from "../dtos/event.dto";
import eventRepository from "../repositories/event.repository";
import uploadService from "../services/upload.service";
import { IEventDoc } from "../utils/interface.util";
import User from "../models/User.model";



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
      return next(new ErrorResponse("Error", 401, ["Unauthorized user"]));
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
      return next(new ErrorResponse("Error", 400, [validate.message]));
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
      return next(new ErrorResponse("Error", event.code!, [event.message]));
    }

    const imageFile = (req as any).file
    // ?.find(
    //   (f: any) => f.fieldname === "file"
    // );

    let imageUrl = "";

    const ImageData = {
      stream: imageFile.stream,
      mimeType: imageFile.mimeType,
      originalFileName: imageFile.fileName,
      refId: event.data._id,
    };

    if (imageFile) {
      imageUrl = await uploadService.uploadFile(ImageData);
    }
    if (imageUrl && imageUrl !== event.data.image) {
      await eventRepository.updateEvent(event.data._id, { image: imageUrl });
      event.data.image = imageUrl;
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: {
        title: event.data.title,
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
 * @description Updates an event
 * @route PATCH /events/:id
 * @access Private
 */
export const updateEvent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

    const userId = (req as any).user?.id;
    if (!userId) {
      return next(new ErrorResponse("Error", 401, ["Unauthorized user"]));
    }

    const eventId = req.params.id;
    if (!eventId) {
      return next(new ErrorResponse("Event ID is required", 400, []));
    }

    const {
      title,
      content,
      features,
      joinUrl,
      planUrl,
      sponsorUrl,
      communityUrl,
    } = req.body;

    // Fetch existing event via repository
    const existingEvent = await eventRepository.findById(eventId);
    if (existingEvent.error || !existingEvent.data) {
      return next(new ErrorResponse(existingEvent.message, 404, []));
    }

    //   const contentParseResult = validationService.parseAndValidateContent(rawContent);
    // if (contentParseResult.error) {
    //   return next(new ErrorResponse("Error", 400, [contentParseResult.message]));
    // }
    // const parsedContent = contentParseResult.data || [];

    //  const featuresParseResult = validationService.parseAndValidateFeatures(rawFeatures);
    // if (featuresParseResult.error) {
    //   return next(new ErrorResponse("Error", 400, [featuresParseResult.message]));
    // }
    // const parsedFeatures = featuresParseResult.data || [];
    

    const validate = await validationService.validateUpdateEvent({
      title,
      content,
      features,
      joinUrl,
      planUrl,
      sponsorUrl,
      communityUrl,
    });

    if (validate.error) {
      return next(new ErrorResponse("Validation failed", 400, [validate.message]));
    }

    const updateData: any = {
      title,
      content,
      features,
      joinUrl,
      planUrl,
      sponsorUrl,
      communityUrl,
    };

    const imageFile = (req as any).file;
    if (imageFile) {
      const ImageData = {
        stream: imageFile.stream,
        mimeType: imageFile.mimeType,
        originalFileName: imageFile.fileName,
        refId: existingEvent.data._id.toString(),
      };

      const imageUrl = await uploadService.uploadFile(ImageData);
      updateData.image = imageUrl;
    }

    const updatedEvent = await eventRepository.updateEvent(eventId, updateData);
    if (updatedEvent.error || !updatedEvent.data) {
      return next(
        new ErrorResponse("Failed to update event", updatedEvent.code || 500, [
          updatedEvent.message,
        ])
      );
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: updatedEvent.data,
      message: "Event updated successfully.",
      status: 200,
    });
  }
);


/**
 * @name getEventById
 * @description Get event by ID
 * @route GET /events/:id
 * @access Public
 */
export const getEventById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await eventRepository.findById(id, true);
    if (result.error || !result.data) {
      return next(new ErrorResponse("Error", 404, ["Event not found"]));
    }

    const event = result.data as IEventDoc;

    res.status(200).json({
      error: false,
      errors: [],
      data: {
        title: event.title,
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
      return next(new ErrorResponse("Unauthorized", 401, ["Unauthorized user"]));
    }

    // Check if user exists
    // const user = await userRepository.findById(userId);
    // if (!user) {
    //   return next(new ErrorResponse("User not found", 404, ["User not found"]));
    // }

     const user = await User.findById(userId).lean();

    if (!user) {
      return next(new ErrorResponse("User not found", 404, ["User not found"]));
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

// export const getUserEvents = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
    
//     const userId = req.params.userId;
//     if (!userId) {
//       return next(new ErrorResponse("Error", 401, ["Unauthorized user"]));
//     }

//     const user = await userReposirtory.findById(userId);
//     if (!user) {
//       return next(new ErrorResponse("Error", 404, ["User not found"]));
//     }

//     const result = await eventRepository.getUserEvents(userId);

//     res.status(200).json({
//       error: false,
//       errors: [],
//       data: {
//         events: result.data.map((event: IEventDoc) => ({
//           title: event.title,
//           content: event.content,
//           image: event.image,
//           features: event.features,
//           joinUrl: event.joinUrl,
//           planUrl: event.planUrl,
//           sponsorUrl: event.sponsorUrl,
//           communityUrl: event.communityUrl,
//           id: event._id,
//         })),
//       },
//       message: "User events fetched successfully.",
//       status: 200,
//     });
//   }
// );


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

    const event = await eventRepository.findById(id);
    if (!event) {
      return next(new ErrorResponse("Error", 404, ["Event not found"]));
    }

    const result = await eventRepository.deleteEvent(id);

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
