import mongoose, { Model } from "mongoose";
import { IProgramDoc, IResult } from "../utils/interface.util";
import Program from "../models/Program.model";

class ProgramRepository {
  private model: Model<IProgramDoc>;

  constructor() {
    this.model = Program;
  }

  public async getPrograms(): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };

    const programs = await this.model.find({}).populate("uploadedBy", "fullName email").lean();
    if (!programs.length) {
      result.error = true;
      result.code = 404;
      result.message = "No programs found";
      return result;
    }

    result.message = "Programs fetched successfully";
    result.data = programs;
    return result;
  }

  public async getUserPrograms(userId: string): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };

    const programs = await this.model.find({ uploadedBy: userId }).lean();
    if (!programs.length) {
      result.error = true;
      result.code = 404;
      result.message = "No programs found for this user";
      return result;
    }

    result.message = "User programs fetched successfully";
    result.data = programs;
    return result;
  }

  public async findBySlug(slug: string): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };

    const program = await this.model.findOne({ slug }).populate("uploadedBy", "fullName email");
    if (!program) {
      result.error = true;
      result.code = 404;
      result.message = "Program not found";
      return result;
    }

    result.message = "Program fetched successfully";
    result.data = program;
    return result;
  }


  /**
 * @name findProgram
 * @description Find a document by either MongoDB ObjectId or slug.
 * @param {string} input - The ID or slug
 * @returns {Promise<IResult>} result
 */
public async findProgram(input: string): Promise<IResult> {
  const result: IResult = {
    error: false,
    message: "",
    code: 200,
    data: {},
  };

  const isValidObjectId =
    mongoose.Types.ObjectId.isValid(input) &&
    new mongoose.Types.ObjectId(input).toString() === input;

  const document = isValidObjectId
    ? await this.model.findById(input)
    : await this.model.findOne({ slug: input });

  if (!document) {
    result.error = true;
    result.code = 404;
    result.message = "Item not found";
    return result;
  }

  result.data = document.toJSON();
  result.message = "Item fetched successfully";
  return result;
}

  public async createProgram(data: Partial<IProgramDoc>): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 201, data: {} };

    const created = await this.model.create(data);
    if (!created) {
      result.error = true;
      result.code = 500;
      result.message = "Failed to create program";
      return result;
    }

    result.message = "Program created successfully";
    result.data = created;
    return result;
  }

  public async updateProgram(id: string, data: Partial<IProgramDoc>): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };

    const updated = await this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      result.error = true;
      result.code = 404;
      result.message = "Program not found";
      return result;
    }

    result.message = "Program updated successfully";
    result.data = updated;
    return result;
  }

  public async deleteProgram(id: string): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };

    const deleted = await this.model.findByIdAndDelete(id);
    if (!deleted) {
      result.error = true;
      result.code = 404;
      result.message = "Program not found";
      return result;
    }

    result.message = "Program deleted successfully";
    result.data = deleted;
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

export default new ProgramRepository();
