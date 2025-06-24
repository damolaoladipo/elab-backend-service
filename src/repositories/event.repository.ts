import { FilterQuery, Model } from "mongoose";
import { IEvent, IResult } from "../utils/interface.util";
import Event from "../models/Event.model";

class EventRepository {
  private model: Model<IEvent>;

  constructor() {
    this.model = Event;
  }

  /**
   * @name findById
   * @param id
   * @param populate
   * @returns {Promise<IEvent | null>}
   */
  public async findById(
    id: string,
    populate: boolean = false
  ): Promise<IEvent | null> {
    const query: FilterQuery<IEvent> = { _id: id };

    const pop = populate ? [{ path: "user" }] : [];

    const event = await this.model.findById(query).populate(pop);
    if (!event) {
      return null;
    }
    return event;
  }

  /**
 * @name getUserEvents
 * @param userId
 * @returns {Promise<IResult>}
 * @description Get all events created by a specific user
 */
public async getUserEvents(userId: string | Object): Promise<IResult> {
  let result: IResult = { error: false, message: "", code: 200, data: {} };

  const events = await this.model.find({ user: userId }).lean();

  result.data = events;

  return result;
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
  public async createEvent(data: Partial<IEvent>): Promise<IResult> {
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
    data: Partial<IEvent>
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
