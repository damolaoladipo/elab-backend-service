import { FilterQuery, Model, ObjectId } from "mongoose";
import { IEventDoc, IResult } from "../utils/interface.util";
import Event from "../models/Event.model";

class EventRepository {
  private model: Model<IEventDoc>;

  constructor() {
    this.model = Event;
  }

  /**
   * @name findById
   * @param id
   * @param populate
   * @returns {Promise<IEventDoc | null>}
   */
 public async findById(id: string, populate: boolean = false): Promise<IResult> {
  const result: IResult = { error: false, message: "", code: 200, data: {} };

  const pop = populate ? [{ path: "user" }] : [];
  const event = await this.model.findById(id).populate(pop);

  if (!event) {
    return {
      error: true,
      message: "Event not found",
      code: 404,
      data: {},
    };
  }

  result.message = "Event found";
  result.data = event;
  return result;
}


  /**
 * @name getUserEvents
 * @param userId
 * @returns {Promise<IResult>}
 * @description Get all events created by a specific user
 */
public async getUserEvents(userId: string | ObjectId): Promise<IResult> {
  const result: IResult = {
    error: false,
    message: "User events fetched successfully",
    code: 200,
    data: [],
  };

  const events = await this.model
    .find({ user: userId })
    .populate({
      path: "user",
      select: "_id name email",
    })
    .sort({ createdAt: -1 });

  if (!events || events.length === 0) {
    result.error = true;
    result.message = "No events found";
    result.code = 404;
    result.data = [];
  } else {
    result.data = events;
  }

  return result;
}


public async findBySlug(slug: string): Promise<IResult> {
  const result: IResult = {
    error: false,
    message: "",
    code: 200,
    data: {},
  };

  try {
    const event = await this.model.findOne({ slug });

    if (!event) {
      result.error = true;
      result.code = 404;
      result.message = "Event not found";
      return result;
    }

    result.data = event.toJSON();
    result.message = "Event fetched successfully";
    return result;
  } catch (err: any) {
    result.error = true;
    result.code = 500;
    result.message = err.message;
    return result;
  }
}


  /**
   * @name getEvents
   * @returns {Promise<IResult>}
   */
  public async getEvents(): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };


    const events = await this.model.find({}).lean();
    if (!events || events.length === 0) {
      result.error = true;
      result.code = 404;
      result.message = "No events found";
      return result;
    }
    result.data = events;
    return result;
  }

  /**
   * @name createEvent
   * @param data
   * @returns {Promise<IResult>}
   */
  public async createEvent(data: Partial<IEventDoc>): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 201, data: {} };

    const event = await this.model.create(data);
    if (!event) {
      result.error = true;
      result.code = 500;
      result.message = "Failed to create event";
      return result;
    }
    result.message = "Event created successfully";
    result.data = event;
    return result;
  }

  /**
   * @name updateEvent
   * @param id
   * @param data
   * @returns {Promise<IResult>}
   */
  public async updateEvent(
    id: string,
    data: Partial<IEventDoc>
  ): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };
    const event = await this.model.findByIdAndUpdate(id, data, { new: true });
    if (!event) {
      result.error = true;
      result.code = 404;
      result.message = "Event not found";
    } else {
      result.message = "Event updated successfully";
      result.data = event;
    }
    return result;
  }

  /**
   * @name deleteEvent
   * @param id
   * @returns {Promise<IResult>}
   */
  public async deleteEvent(id: string): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };
    const deletedEvent = await this.model.findByIdAndDelete(id);
    if (!deletedEvent) {
      result.error = true;
      result.code = 404;
      result.message = "Event not found";
    } else {
      result.message = "Event deleted successfully";
      result.data = deletedEvent;
    }
    return result;
  }
}

export default new EventRepository();
