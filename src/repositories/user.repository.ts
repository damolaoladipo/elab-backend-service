import mongoose, { FilterQuery, Model, ObjectId } from "mongoose";
import User from "../models/User.model";
import { IResult, IUserDoc } from "../utils/interface.util";
import tokenService from "../services/token.service";

class UserRepository {
  private model: Model<IUserDoc>;

  constructor() {
    this.model = User;
  }

  /**
   * @name findByIdOrSlug
   * @description Find a user by either MongoDB ObjectId or slug (e.g. username).
   * @param input - The user ID (ObjectId or string) or username slug
   * @param populate - Whether to populate related fields (e.g. events)
   * @returns Promise<IResult>
   */
  public async findUser(input: string, populate = false): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };

    const isObjectId =
      mongoose.Types.ObjectId.isValid(input) &&
      new mongoose.Types.ObjectId(input).toString() === input;

    let query = isObjectId
      ? this.model.findById(input)
      : this.model.findOne({ slug: input });

    if (populate) {
      query = query.populate("events");
    }

    const user = await query.lean();

    if (!user) {
      return {
        error: true,
        message: "User not found",
        code: 404,
        data: {},
      };
    }

    result.message = "User found";
    result.data = user;
    return result;
  }

  /**
   * @name findByEmail
   * @param email
   * @returns {Promise<IResult>}
   */
  public async findByEmail(email: string): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const user = await this.model.findOne({ email }).lean();
    if (!user) {
      result.error = true;
      result.code = 404;
      result.message = "User not found";
    } else {
      result.data = user;
    }

    return result;
  }

  /**
   * @name getUsers
   * @returns {Promise<IResult>}
   */
  public async getUsers(): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const users = await this.model.find({}).lean();
    result.data = users;

    return result;
  }

  /**
   * @name createUser
   * @param userData
   * @returns {Promise<IResult>}
   */
  public async createUser(userData: Partial<IUserDoc>): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 201, data: {} };

    const newUser = await this.model.create(userData);
    result.data = newUser;
    result.message = "User created successfully";

    return result;
  }

  /**
   * @name deleteUser
   * @param id
   * @returns {Promise<IResult>}
   */
  public async deleteUser(id: string): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const deletedUser = await this.model.findByIdAndDelete(id);
    if (!deletedUser) {
      result.error = true;
      result.code = 404;
      result.message = "User not found";
    } else {
      result.message = "User deleted successfully";
      result.data = deletedUser;
    }

    return result;
  }

  /**
   * @name updateUser
   * @param id
   * @param updateData
   * @returns {Promise<IResult>}
   */
  public async updateUser(
    id: string,
    updateData: Partial<IUserDoc>
  ): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const updatedUser = await this.model.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedUser) {
      result.error = true;
      result.code = 404;
      result.message = "User not found";
    } else {
      result.message = "User updated successfully";
      result.data = updatedUser;
    }

    return result;
  }

  /**
   * @name getAuthToken
   * @param user
   * @returns {Promise<IResult>}
   */
  public async getAuthToken(user: IUserDoc): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const tokenResult = await tokenService.attachToken(user);
    if (tokenResult.error) {
      result.error = true;
      result.code = 500;
      result.message = tokenResult.message;
    } else {
      result.message = "Token generated successfully";
      result.data = { token: tokenResult.data.token };
    }

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

export default new UserRepository();
