import { FilterQuery, Model, ObjectId } from "mongoose";
import Resource from "../models/Resource.model";
import { IResult, IResourceDoc } from "../utils/interface.util";

class ResourceRepository {
  private model: Model<IResourceDoc>;

  constructor() {
    this.model = Resource;
  }

  /**
   * @name findById
   * @param id
   * @param populate
   * @returns {Promise<IResourceDoc | null>}
   * @description Find a resource by ID and optionally populate related data
   */
  public async findById(
    id: string,
    populate: boolean = false
  ): Promise<IResourceDoc | null> {
    const dataPop = [{ path: "user" }];
    const pop = populate ? dataPop : [];

    const query: FilterQuery<IResourceDoc> = { _id: id };

    const resource = await this.model.findById(query).populate(pop);
    if (!resource) {
      throw new Error("Resource not found");
    }

    return resource;
  }

  /**
   * @name getResources
   * @returns {Promise<IResult>}
   * @description Get all resources
   */
  public async getResources(): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };
    const resources = await this.model.find({}).lean();
    if (!resources || resources.length === 0) {
      result.error = true;
      result.code = 404;
      result.message = "No resources found";
      return result;
    }
    result.message = "Resources fetched successfully";
    result.data = resources;
    return result;
  }

  /**
   * @name getUserResources
   * @param userId
   * @returns {Promise<IResult>}
   * @description Get all resources for a specific user
   */
  public async getUserResources(userId: string | ObjectId): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };
   
    const resources = await this.model.find({ user: userId }).lean();
    if (!resources || resources.length === 0) {
      result.error = true;
      result.code = 404;
      result.message = "No resources found for this user";
      return result;
    }
    result.message = "User resources fetched successfully";
    result.data = resources;
    return result;
  }

  /**
   * @name createResource
   * @param resourceData
   * @returns {Promise<IResult>}
   * @description Create a new resource
   */
  public async createResource(
    resourceData: Partial<IResourceDoc>
  ): Promise<IResult> {
    let result: IResult = {
      error: false,
      message: "Resource created successfully",
      code: 201,
      data: {},
    };

    const newResource = await this.model.create(resourceData);

    if (!newResource) {
      result.error = true;
      result.code = 500;
      result.message = "Failed to create resource";
      return result;
    }
    result.message = "Resource created successfully";
    result.data = newResource;
    return result;
  }

  /**
   * @name updateResource
   * @param id
   * @param updateData
   * @returns {Promise<IResult>}
   * @description Update an existing resource by ID
   */
  public async updateResource(
    id: string,
    updateData: Partial<IResourceDoc>
  ): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };
    const updatedResource = await this.model.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedResource) {
      result.error = true;
      result.code = 404;
      result.message = "Resource not found";
    } else {
      result.message = "Resource updated successfully";
      result.data = updatedResource;
    }
    return result;
  }

  /**
   * @name deleteResource
   * @param id
   * @returns {Promise<IResult>}
   * @description Delete a resource by ID
   */
  public async deleteResource(id: string): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };
    const deletedResource = await this.model.findByIdAndDelete(id);
    if (!deletedResource) {
      result.error = true;
      result.code = 404;
      result.message = "Resource not found";
    } else {
      result.message = "Resource deleted successfully";
      result.data = deletedResource;
    }
    return result;
  }
}

export default new ResourceRepository();
