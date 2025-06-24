import { FilterQuery, Model, ObjectId } from "mongoose";
import Archive from "../models/Archive.model";
import { IResult, IArchiveDoc } from "../utils/interface.util";

class ArchiveRepository {
  private model: Model<IArchiveDoc>;

  constructor() {
    this.model = Archive;
  }

  public async findById(
    id: string,
    populate: boolean = false
  ): Promise<IArchiveDoc | null> {
    const dataPop = [{ path: "user" }];
    const pop = populate ? dataPop : [];

    const query: FilterQuery<IArchiveDoc> = { _id: id };

    const archive = await this.model.findById(query).populate(pop); 
    if (!archive) {
        
      return null;
    }

    return archive;
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
    result.data = newArchive;
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
