import mongoose, { Model, ObjectId } from "mongoose";
import Store from "../models/Store.model";
import { IStoreDoc, IResult } from "../utils/interface.util";

class StoreRepository {
  private model: Model<IStoreDoc>;

  constructor() {
    this.model = Store;
  }

  /**
   * @name createStore
   * @description Creates a new store item
   * @param data Store item data
   * @returns {Promise<IResult>}
   */
  public async createStore(data: Partial<IStoreDoc>): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 201, data: {} };

    const item = await this.model.create(data);
    if (!item) {
      result.error = true;
      result.code = 500;
      result.message = "Failed to create store item";
      return result;
    }
    result.data = item;
    result.message = "Store item created";
    return result;
  }

  /**
   * @name updateStore
   * @description Updates a store item by ID
   * @param id Store item ID
   * @param data Update data
   * @returns {Promise<IResult>}
   */
  public async updateStore(
    id: string,
    data: Partial<IStoreDoc>
  ): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };

    const updated = await this.model
      .findByIdAndUpdate(id, data, { new: true })
      .lean();
    if (!updated) {
      return {
        error: true,
        code: 404,
        message: "Store item not found",
        data: {},
      };
    }
    result.data = updated;
    if (!result.data) {
      result.error = true;
      result.code = 500;
      result.message = "Failed to update store item";
      return result;
    }
    result.message = "Store item updated";
    return result;
  }

  /**
   * @name findBySlug
   * @description Finds a store item by its slug
   * @param slug Store item slug
   * @returns {Promise<IResult>}
   */
  public async findStore(input: string): Promise<IResult> {
    const result: IResult = {
      error: false,
      message: "",
      code: 200,
      data: {},
    };

    const isValidObjectId =
      mongoose.Types.ObjectId.isValid(input) &&
      new mongoose.Types.ObjectId(input).toString() === input;

    const item = isValidObjectId
      ? await this.model.findById(input)
      : await this.model.findOne({ slug: input });

    if (!item) {
      result.error = true;
      result.code = 404;
      result.message = "Store item not found";
      return result;
    }

    result.data = item.toJSON();
    result.message = "Store item fetched successfully";
    return result;
  }

  /**
   * @name getStores
   * @description Fetches all store items
   * @returns {Promise<IResult>}
   */
  public async getStores(): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };
    const items = await this.model.find({}).sort({ createdAt: -1 }).lean();
    if (!items || items.length === 0) {
      return {
        error: true,
        code: 404,
        message: "No store items found",
        data: {},
      };
    }
    result.data = items;
    return result;
  }

  /**
   * @name deleteStore
   * @description Deletes a store item by ID
   * @param id Store item ID
   * @returns {Promise<IResult>}
   */
  public async deleteStore(id: string): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };
    const deleted = await this.model.findByIdAndDelete(id);
    if (!deleted) {
      return {
        error: true,
        code: 404,
        message: "Store item not found",
        data: {},
      };
    }
    result.message = "Store item deleted";
    return result;
  }

  /**
 * @name slugExists
 * @description Checks if a slug already exists in the database.
 * @param {string} slug - The slug to check for existence.
 * @returns {Promise<boolean>} - Returns true if the slug exists, false otherwise.
 */
  public async slugExists(slug: string): Promise<boolean> {
  const exists = await this.model.exists({ slug });
  return !!exists;
}
}

export default new StoreRepository();
