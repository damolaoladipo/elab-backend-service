import { Model } from "mongoose";
import Newsletter from "../models/newsletter.model";
import { INewsletterDoc, IResult } from "../utils/interface.util";


class NewsletterRepository {
  private model: Model<INewsletterDoc>;

  constructor() {
      this.model = Newsletter;
    }
  

  /**
   * @name create
   */
  public async create(email: string): Promise<IResult> {
    const result: IResult = {
      error: false,
      message: "",
      code: 201,
      data: {},
    };

    try {
      const existing = await this.model.findOne({ email });

      if (existing) {
        result.error = true;
        result.code = 409;
        result.message = "You are already subscribed to our newsletter";
        return result;
      }

      const newEntry = await this.model.create({ email, subscribedAt: new Date(), });
      result.data = newEntry.toJSON();
      result.message = "Subscribed successfully";
    } catch (err) {
      result.error = true;
      result.code = 500;
      result.message = "Failed to subscribe";
    }

    return result;
  }

  /**
   * @name unsubscribe
   */
  public async unsubscribe(email: string): Promise<IResult> {
    const result: IResult = {
      error: false,
      message: "",
      code: 200,
      data: {},
    };

    const record = await this.model.findOne({ email });
    if (!record) {
      result.error = true;
      result.code = 404;
      result.message = "Email not found";
      return result;
    }

    record.isSubsribed = false;
    await record.save();

    result.data = record.toJSON();
    result.message = "Unsubscribed successfully";
    return result;
  }

  /**
   * @name findAll
   */
  public async findAll(): Promise<IResult> {
    const result: IResult = {
      error: false,
      message: "",
      code: 200,
      data: {},
    };

    const entries = await this.model.find();
    result.data = entries.map((entry) => entry.toJSON());
    result.message = "All subscribers fetched";
    return result;
  }

  /**
   * @name findOne
   */
  public async findOne(email: string): Promise<IResult> {
    const result: IResult = {
      error: false,
      message: "",
      code: 200,
      data: {},
    };

    const entry = await this.model.findOne({ email });
    if (!entry) {
      result.error = true;
      result.code = 404;
      result.message = "Subscriber not found";
      return result;
    }

    result.data = entry.toJSON();
    result.message = "Subscriber fetched";
    return result;
  }
}

export default new NewsletterRepository()