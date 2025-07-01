import { CreateArchiveDTO, UpdateArchiveDTO } from "../dtos/archive.dto";
import { CreateCompanyDTO, UpdateCompanyDTO } from "../dtos/company.dto";
import { CreateEventDTO, UpdateEventDTO } from "../dtos/event.dto";
import { CreateProjectDTO, UpdateProjectDTO } from "../dtos/project.dto";
import { IResult, IWysiwygContent } from "../utils/interface.util";

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
    if (!data.content) return this.error("content is required");
    if (!data.category) return this.error("category is required");
    if (!data.status) return this.error("status is required");
    
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


  // ===== COMPANY =====
  /**
   * @name validateCreateCompany
   * @description Validates create company input
   * @param data
   */
  public async validateCreateCompany(data: CreateCompanyDTO): Promise<IResult> {
    if (!data.name) return this.error("name is required");
    if (!data.description) return this.error("description is required");
    if (!data.status) return this.error("status is required");
    
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


/**
   * @name parseAndValidateContent
   * @description Parses and validates the raw content string from req.body
   * @param rawContent The content string from req.body
   * @returns {IResult & { data?: IWysiwygContent[] }} Returns an IResult object with parsed data if successful
   */
  public parseAndValidateContent(rawContent: string | IWysiwygContent[] | undefined): IResult & { data?: IWysiwygContent[] } {
    if (rawContent === undefined) {
      // If content is optional for an update, return success with no data
      // If required for creation, validationService.validateCreateEvent should handle the 'undefined' case
      return this.ok();
    }

    let parsedContent: IWysiwygContent[] = [];
    try {
      if (typeof rawContent === 'string') {
        parsedContent = JSON.parse(rawContent);
      } else if (Array.isArray(rawContent)) {
        parsedContent = rawContent;
      } else {
        return this.error("Content format is invalid. Expected string or array.");
      }

      // Optional: Add more specific validation for the structure of each IWysiwygContent item
      if (!Array.isArray(parsedContent)) {
        return this.error("Content must be a JSON array of content blocks.");
      }
      for (const block of parsedContent) {
        if (!block || typeof block.type !== 'string') { // Basic check for 'type' field
          return this.error("Each content block must have a 'type'.");
        }
        // Add more checks based on your IWysiwygContent structure
      }

      return { ...this.ok(), data: parsedContent };
    } catch (e: any) {
      console.error("Error parsing content:", e);
      return this.error("Invalid content format. Please send as a JSON array string of content blocks.");
    }
  }

  /**
   * @name parseAndValidateFeatures
   * @description Parses and validates the raw features string from req.body
   * @param rawFeatures The features string from req.body
   * @returns {IResult & { data?: string[] }} Returns an IResult object with parsed data if successful
   */
  public parseAndValidateFeatures(rawFeatures: string | string[] | undefined): IResult & { data?: string[] } {
    if (rawFeatures === undefined) {
      // If features is optional, return success with no data
      return this.ok();
    }

    let parsedFeatures: string[] = [];
    try {
      if (typeof rawFeatures === 'string') {
        parsedFeatures = JSON.parse(rawFeatures);
      } else if (Array.isArray(rawFeatures)) {
        parsedFeatures = rawFeatures;
      } else {
        return this.error("Features format is invalid. Expected string or array.");
      }

      if (!Array.isArray(parsedFeatures) || parsedFeatures.some(f => typeof f !== 'string')) {
        return this.error("Features must be a JSON array of strings.");
      }

      return { ...this.ok(), data: parsedFeatures };
    } catch (e: any) {
      console.error("Error parsing features:", e);
      return this.error("Invalid features format. Please send as a JSON array string.");
    }
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
