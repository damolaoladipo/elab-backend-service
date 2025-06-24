import { FilterQuery, Model, ObjectId } from "mongoose";
import Project from "../models/Project.model";
import { IResult, IProjectDoc } from "../utils/interface.util";

class ProjectRepository {
  private model: Model<IProjectDoc>;

  constructor() {
    this.model = Project;
  }

  /**
   * @name findById
   * @param id
   * @param populate
   * @returns project
   * @description Find a project by ID and populate related data
   */
  public async findById(id: string, populate: boolean = false): Promise<IProjectDoc | null> {
    const dataPop = [
      { path: "user" }
    ];

    const pop = populate ? dataPop : [];

    const query: FilterQuery<IProjectDoc> = { _id: id };

    const project = await this.model.findById(query).populate(pop);
    if (!project) {
      return null;
    }
    return project;
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
  public async getUserProjects(userId: string | ObjectId ): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const projects = await this.model.find({ user: userId }).lean();
    result.data = projects;

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
}

export default new ProjectRepository();
