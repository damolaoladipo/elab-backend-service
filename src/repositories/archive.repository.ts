import mongoose, { FilterQuery, Model, ObjectId } from "mongoose";
import Archive from "../models/Archive.model";
import { IResult, IArchiveDoc } from "../utils/interface.util";

class ArchiveRepository {
  private model: Model<IArchiveDoc>;

  constructor() {
    this.model = Archive;
  }

  /**
   * @name findArchive
   * @param {string} input - The ObjectId or slug of the archive.
   * @returns {Promise<IResult>} Result object containing the archive data or error information.
   * @description Fetch an archive by its ObjectId or slug.
   */
  public async findArchive(input: string): Promise<IResult> {
    const result: IResult = {
      error: false,
      message: "",
      code: 200,
      data: {},
    };

    const isValidObjectId =
      mongoose.Types.ObjectId.isValid(input) &&
      new mongoose.Types.ObjectId(input).toString() === input;

    const archive = isValidObjectId
      ? await this.model.findById(input)
      : await this.model.findOne({ slug: input });

    if (!archive) {
      result.error = true;
      result.message = "Archive not found";
      result.code = 404;
      return result;
    }
    result.data = archive.toJSON();
    result.message = "Archive found";
    return result;
  }

  /**
   * @name getArchives
   * @returns {Promise<IResult>} Result object containing all archives or error information.
   * @description Fetch all archives from the database.
   */
  public async getArchives(): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const archives = await this.model.find({}).lean();
    if (!archives || archives.length === 0) {
      result.error = true;
      result.code = 404;
      result.message = "No archives found";
      return result;
    }
    result.message = "Archives fetched successfully";
    result.code = 200;
    result.data = archives;
    return result;
  }

  /**
   * @name getUserArchives
   * @param userId - The ID of the user whose archives are to be fetched.
   * @returns {Promise<IResult>} Result object containing the user's archives or error information.
   * @description Fetch all archives created by a specific user.
   */
  public async getUserArchives(userId: string | ObjectId): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const archives = await this.model.find({ user: userId }).lean();
    if (!archives || archives.length === 0) {
      result.error = true;
      result.code = 404;
      result.message = "No archives found for this user";
      return result;
    }
    result.message = "Archives fetched successfully";
    result.code = 200;
    result.data = archives;
    return result;
  }

  /**
   * @name createArchive
   * @param archiveData - Partial data for the new archive.
   * @returns {Promise<IResult>} Result object containing the created archive or error information.
   * @description Create a new archive in the database.
   */
  public async createArchive(
    archiveData: Partial<IArchiveDoc>
  ): Promise<IResult> {
    let result: IResult = {
      error: false,
      message: "",
      code: 201,
      data: {},
    };

    const newArchive = await this.model.create(archiveData);
    if (!newArchive) {
      result.error = true;
      result.code = 500;
      result.message = "Failed to create archive";
      return result;
    }
    result.message = "Archive created successfully";
    result.code = 201;
    result.data = newArchive.toJSON();
    return result;
  }

  /**
   * @name updateArchive
   * @param id - The ID of the archive to be updated.
   * @param updateData - Partial data to update the archive.
   * @returns {Promise<IResult>} Result object containing the updated archive or error information.
   * @description Update an existing archive in the database.
   */

  public async updateArchive(
    id: string,
    updateData: Partial<IArchiveDoc>
  ): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };
    const updatedArchive = await this.model.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedArchive) {
      result.error = true;
      result.code = 404;
      result.message = "Archive not found";
    } else {
      result.message = "Archive updated successfully";
      result.data = updatedArchive;
    }
    return result;
  }

  /**
   * @name deleteArchive
   * @param id - The ID of the archive to be deleted.
   * @returns {Promise<IResult>} Result object containing the deleted archive or error information.
   * @description Delete an archive from the database by its ID.
   */
  public async deleteArchive(id: string): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };
    const deletedArchive = await this.model.findByIdAndDelete(id);
    if (!deletedArchive) {
      result.error = true;
      result.code = 404;
      result.message = "Archive not found";
    } else {
      result.message = "Archive deleted successfully";
      result.data = deletedArchive;
    }
    return result;
  }
}

export default new ArchiveRepository();
