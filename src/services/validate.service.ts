import { CreateArchiveDTO, UpdateArchiveDTO } from "../dtos/archive.dto";
import { CreateCompanyDTO, UpdateCompanyDTO } from "../dtos/company.dto";
import { CreateEventDTO, UpdateEventDTO } from "../dtos/event.dto";
import { CreateProjectDTO, UpdateProjectDTO } from "../dtos/project.dto";
import { CreateResourceDTO, UpdateResourceDTO } from "../dtos/resource.dto";
import { IResult } from "../utils/interface.util";

class ValidationService {
  /**
   * @name validateCreateEvent
   * @description Validates create event input
   * @param data
   */
  public async validateCreateEvent(data: CreateEventDTO): Promise<IResult> {
    if (!data.title) return this.error("title is required");
    if (!data.content) return this.error("content is required");
    if (!data.features) return this.error("features is required");
    if (!data.joinUrl) return this.error("joinUrl is required");
    if (!data.planUrl) return this.error("planUrl is required");
    if (!data.sponsorUrl) return this.error("sponsorUrl is required");
    if (!data.communityUrl) return this.error("communityUrl is required");
    return this.ok();
  }

  /**
   * @name validateUpdateEvent
   * @description Validates update event input
   * @param data
   */
  public async validateUpdateEvent(data: UpdateEventDTO): Promise<IResult> {
    if (Object.keys(data).length === 0)
      return this.error("update data is empty");
    return this.ok();
  }

  // ===== PROJECT =====
  /**
   * @name validateCreateProject
   * @description Validates create project input
   * @param data
   */
  public async validateCreateProject(data: CreateProjectDTO): Promise<IResult> {
    if (!data.title) return this.error("title is required");
    if (!data.content) return this.error("content is required");

    if (!data.user) return this.error("user is required");
    return this.ok();
  }

  /**
   * @name validateUpdateProject
   * @description Validates update project input
   * @param data
   */
  public async validateUpdateProject(data: UpdateProjectDTO): Promise<IResult> {
    if (Object.keys(data).length === 0)
      return this.error("update data is empty");
    return this.ok();
  }

  // ===== ARCHIVE =====
  /**
   * @name validateCreateArchive
   * @description Validates create archive input
   * @param data
   */
  public async validateCreateArchive(data: CreateArchiveDTO): Promise<IResult> {
    if (!data.title) return this.error("title is required");
    if (!data.image) return this.error("image is required");
    if (!data.content) return this.error("content is required");
    if (!data.author) return this.error("author is required");
    if (!data.category) return this.error("category is required");
    if (!data.type) return this.error("type is required");
    if (!data.user) return this.error("user is required");
    return this.ok();
  }

  /**
   * @name validateUpdateArchive
   * @description Validates update archive input
   * @param data
   */
  public async validateUpdateArchive(data: UpdateArchiveDTO): Promise<IResult> {
    if (Object.keys(data).length === 0)
      return this.error("update data is empty");
    return this.ok();
  }

  // ===== RESOURCE =====
  /**
   * @name validateCreateResource
   * @description Validates create resource input
   * @param data
   */
  public async validateCreateResource(
    data: CreateResourceDTO
  ): Promise<IResult> {
    if (!data.title) return this.error("title is required");
    if (!data.image) return this.error("image is required");
    if (!data.description) return this.error("description is required");
    if (!data.resource) return this.error("resource link is required");
    if (!data.type) return this.error("type is required");
    if (!data.author) return this.error("author is required");
    if (!data.category) return this.error("category is required");
    if (!data.user) return this.error("user is required");
    return this.ok();
  }

  /**
   * @name validateUpdateResource
   * @description Validates update resource input
   * @param data
   */
  public async validateUpdateResource(
    data: UpdateResourceDTO
  ): Promise<IResult> {
    if (Object.keys(data).length === 0)
      return this.error("update data is empty");
    return this.ok();
  }

  // ===== COMPANY =====
  /**
   * @name validateCreateCompany
   * @description Validates create company input
   * @param data
   */
  public async validateCreateCompany(data: CreateCompanyDTO): Promise<IResult> {
    if (!data.name) return this.error("name is required");
    if (!data.description) return this.error("description is required");
    if (!data.logo) return this.error("logo is required");
    if (!data.status) return this.error("status is required");
    if (!data.url) return this.error("url is required");
    if (!data.email) return this.error("email is required");
    if (!data.brochure) return this.error("brochure is required");
    if (!data.user) return this.error("user is required");
    return this.ok();
  }

  /**
   * @name validateUpdateCompany
   * @description Validates update company input
   * @param data
   */
  public async validateUpdateCompany(data: UpdateCompanyDTO): Promise<IResult> {
    if (Object.keys(data).length === 0)
      return this.error("update data is empty");
    return this.ok();
  }

  // ===== Helper methods =====
  private error(message: string): IResult {
    return { error: true, message, code: 400, data: {} };
  }

  private ok(): IResult {
    return { error: false, message: "", code: 200, data: {} };
  }
}

export default new ValidationService();
