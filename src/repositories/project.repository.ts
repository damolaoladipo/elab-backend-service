import mongoose, { FilterQuery, Model, ObjectId } from "mongoose";
import Project from "../models/Project.model";
import { IResult, IProjectDoc } from "../utils/interface.util";

class ProjectRepository {
  private model: Model<IProjectDoc>;

  constructor() {
    this.model = Project;
  }

 
  /**
   * @name findProject
   * @param {string} input - The ObjectId or slug of the project.
   * @returns {Promise<IResult>} Result object containing the project data or error information.
   * @description Fetch a project by its ObjectId or slug.
   */
  public async findProject(input: string): Promise<IResult> {
  const result: IResult = {
    error: false,
    message: "",
    code: 200,
    data: {},
  };

     const isValidObjectId =
      mongoose.Types.ObjectId.isValid(input) &&
      new mongoose.Types.ObjectId(input).toString() === input;

    const project = isValidObjectId
      ? await this.model.findById(input)
      : await this.model.findOne({ slug: input });

    if (!project) {
      result.error = true;
      result.code = 404;
      result.message = "Project not found";
      return result;
    }

    result.data = project.toJSON();
    result.message = "Project fetched successfully";
    return result;
}


  /**
   * @name getProjects
   * @returns {Promise<IResult>}
   */
  public async getProjects(): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const projects = await this.model.find({}).lean();
    if (!projects || projects.length === 0) {
      result.error = true;
      result.code = 404;
      result.message = "No projects found";
      return result;
    }
    result.message = "Projects fetched successfully";
    result.code = 200;
    result.data = projects;

    return result;
  }

  /**
   * @name getUserProjects
   * @param userId
   * @returns {Promise<IResult>}
   */
  public async getUserProjects(userId: string | ObjectId): Promise<IResult> {
    const result: IResult = {
      error: false,
      message: "",
      code: 200,
      data: [],
    };
  
    const events = await this.model
      .find({ user: userId })
      .populate({
        path: "user",
        select: "_id name email",
      })
      .sort({ createdAt: -1 });
  
    if (!events || events.length === 0) {
      result.error = true;
      result.message = "No events found";
      result.code = 404;
      result.data = [];
    } else {
      result.message = "Events fetched successfully";
      result.code = 200;
      result.data = events;
    }
  
    return result;
  }


  /**
   * @name createProject
   * @param projectData
   * @returns {Promise<IResult>}
   */
  public async createProject(projectData: Partial<IProjectDoc>): Promise<IResult> {
    let result: IResult = { error: false, message: "Project created successfully", code: 201, data: {} };

    const newProject = await this.model.create(projectData);
    if (!newProject) {
      result.error = true;
      result.code = 500;
      result.message = "Failed to create project";
      return result;
    }
    result.message = "Project created successfully";
    result.code = 201;
    result.data = newProject;

    return result;
  }



  /**
   * @name updateProject
   * @param id
   * @param updateData
   * @returns {Promise<IResult>}
   */
  public async updateProject(id: string, updateData: Partial<IProjectDoc>): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const updatedProject = await this.model.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedProject) {
      result.error = true;
      result.code = 404;
      result.message = "Project not found";
    } else {
      result.message = "Project updated successfully";
      result.data = updatedProject;
    }

    return result;
  }

  /**
   * @name deleteProject
   * @param id
   * @returns {Promise<IResult>}
   */
  public async deleteProject(id: string): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const deletedProject = await this.model.findByIdAndDelete(id);
    if (!deletedProject) {
      result.error = true;
      result.code = 404;
      result.message = "Project not found";
    } else {
      result.message = "Project deleted successfully";
      result.data = deletedProject;
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


export default new ProjectRepository();
