import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import validationService from "../services/validate.service";
import { CreateEventDTO, UpdateEventDTO } from "../dtos/event.dto";
import eventRepository from "../repositories/event.repository";
import userReposirtory from "../repositories/user.reposirtory";


/**
 * @name createEvent
 * @description Creates a new event
 * @route POST /events
 * @access Private
 */
export const createEvent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    
    const {
      name,
      eventType,
      lcoation,
      image,
      description,
      features,
      startDate,
      endDate,
      userId,
    }: CreateEventDTO = req.body;

    const validate = await validationService.validateCreateEvent(req.body);
    if (validate.error) {
      return next(new ErrorResponse("Error", 400, [validate.message]));
    }

    const data = {
      name,
      eventType,
      lcoation,
      image,
      description,
      features,
      startDate,
      endDate,
      userId,
    };

    const event = await eventRepository.createEvent(data);

    res.status(200).json({
      error: false,
      errors: [],
      data: event,
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
    const {
      name,
      eventType,
      lcoation,
      image,
      description,
      features,
      startDate,
      endDate,
      userId,
    }: UpdateEventDTO = req.body;

    const validate = await validationService.validateUpdateEvent(req.body);
    if (validate.error) {
      return next(new ErrorResponse("Error", 400, [validate.message]));
    }

    const data = {
      name,
      eventType,
      lcoation,
      image,
      description,
      features,
      startDate,
      endDate,
      userId,
    };

    const { id } = req.params;
    const result = await eventRepository.updateEvent(id, data);

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
 * @name getEventById
 * @description Get event by ID
 * @route GET /events/:id
 * @access Public
 */
export const getEventById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const event = await eventRepository.findById(id, true);

    if (!event) {
      return next(new ErrorResponse("Error", 404, ["Event not found"]));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: event,
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
    const { userId } = req.params;

     const user = await userReposirtory.findById(userId);
        if (!user) {
          return next(new ErrorResponse("Error", 404, ["User not found"]));
        }

    const result = await eventRepository.getUserEvents(user._id);

    res.status(200).json({
      error: false,
      errors: [],
      data: result.data,
      message: "User events fetched successfully.",
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
export const getEvents = asyncHandler(
  async (_req: Request, res: Response) => {
    
    const result = await eventRepository.getEvents();

    res.status(200).json({
      error: false,
      errors: [],
      data: result.data,
      message: "Events fetched successfully.",
      status: 200,
    });
  }
);



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
