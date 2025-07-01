import { Model, ObjectId } from "mongoose";
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
  public async updateStore(id: string, data: Partial<IStoreDoc>): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };
    
    const updated = await this.model.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!updated) {
      return { error: true, code: 404, message: "Store item not found", data: {} };
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
   * @name findById
   * @description Finds a store item by its ID
   * @param id Store item ID
   * @returns {Promise<IResult>}
   */
  public async findById(id: string | ObjectId): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };
    const item = await this.model.findById(id).lean();
    if (!item) {
      return { error: true, code: 404, message: "Store item not found", data: {} };
    }
    result.data = item;
    result.message = "Store item found";
    result.code = 200;
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
      return { error: true, code: 404, message: "No store items found", data: {} };
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
      return { error: true, code: 404, message: "Store item not found", data: {} };
    }
    result.message = "Store item deleted";
    return result;
  }
}

export default new StoreRepository();
