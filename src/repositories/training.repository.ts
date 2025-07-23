import mongoose, { Model } from "mongoose";
import { ITrainingDoc, IResult } from "../utils/interface.util";
import Training from "../models/Training.model";

class TrainingRepository {
  private model: Model<ITrainingDoc> = Training;

  public async getTrainings(): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };
    const trainings = await this.model.find({}).populate("user", "fullName email").lean();
    if (!trainings.length) {
      result.error = true;
      result.code = 404;
      result.message = "No trainings found";
      return result;
    }
    result.message = "Trainings fetched successfully";
    result.data = trainings;
    return result;
  }

  public async getUserTrainings(userId: string): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };
    const trainings = await this.model.find({ user: userId }).lean();
    if (!trainings.length) {
      result.error = true;
      result.code = 404;
      result.message = "No trainings found for this user";
      return result;
    }
    result.message = "User trainings fetched successfully";
    result.data = trainings;
    return result;
  }

  public async findTraining(input: string): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };
    const isValidObjectId =
      mongoose.Types.ObjectId.isValid(input) &&
      new mongoose.Types.ObjectId(input).toString() === input;

    const training = isValidObjectId
      ? await this.model.findById(input)
      : await this.model.findOne({ slug: input });

    if (!training) {
      result.error = true;
      result.code = 404;
      result.message = "Training not found";
      return result;
    }
    result.message = "Training fetched successfully";
    result.data = training.toJSON();
    return result;
  }

  public async createTraining(data: Partial<ITrainingDoc>): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 201, data: {} };
    const created = await this.model.create(data);
    if (!created) {
      result.error = true;
      result.code = 500;
      result.message = "Failed to create training";
      return result;
    }
    result.message = "Training created successfully";
    result.data = created;
    return result;
  }

  public async updateTraining(
    id: string,
    data: Partial<ITrainingDoc>
  ): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };
    const updated = await this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      result.error = true;
      result.code = 404;
      result.message = "Training not found";
      return result;
    }
    result.message = "Training updated successfully";
    result.data = updated;
    return result;
  }

  public async deleteTraining(id: string): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };
    const deleted = await this.model.findByIdAndDelete(id);
    if (!deleted) {
      result.error = true;
      result.code = 404;
      result.message = "Training not found";
      return result;
    }
    result.message = "Training deleted successfully";
    result.data = deleted;
    return result;
  }

  public async slugExists(slug: string): Promise<boolean> {
    const exists = await this.model.exists({ slug });
    return !!exists;
  }
}

export default new TrainingRepository();
