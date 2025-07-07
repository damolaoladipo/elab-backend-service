import { FilterQuery, Model, ObjectId } from "mongoose";
import Archive from "../models/Archive.model";
import { IResult, IArchiveDoc } from "../utils/interface.util";

class ArchiveRepository {
  private model: Model<IArchiveDoc>;

  constructor() {
    this.model = Archive;
  }

 public async findById(id: string | ObjectId): Promise<IResult> {
    const result: IResult = {
      error: false,
      message: "",
      code: 200,
      data: {},
    };

    try {
      const archive = await this.model.findById(id).lean();

      if (!archive) {
        result.error = true;
        result.message = "Archive not found";
        result.code = 404;
        return result;
      }

      result.message = "Archive found";
      result.data = archive;
      return result;
    } catch (error: any) {
      return {
        error: true,
        message: error.message || "Error fetching archive",
        code: 500,
        data: {},
      };
    }
  }

  public async findBySlug(slug: string): Promise<IResult> {
  const result: IResult = {
    error: false,
    message: "",
    code: 200,
    data: {},
  };

  try {
    const archive = await this.model.findOne({ slug });

    if (!archive) {
      result.error = true;
      result.code = 404;
      result.message = "Archive not found";
      return result;
    }

    result.data = archive.toJSON();
    result.message = "Archive fetched successfully";
    return result;
  } catch (err: any) {
    result.error = true;
    result.code = 500;
    result.message = err.message;
    return result;
  }
}




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
