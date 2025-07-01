import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import validationService from "../services/validate.service";
import { CreateCompanyDTO, UpdateCompanyDTO } from "../dtos/company.dto";
import companyRepository from "../repositories/company.repository";
import uploadService from "../services/upload.service";

/**
 * @name createCompany
 * @description Creates a new company
 * @route POST /companies
 * @access Private
 */
export const createCompany = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      description,
      content,
      status,
      websiteUrl,
      contact,
    }: CreateCompanyDTO = req.body;

    const validate = await validationService.validateCreateCompany(req.body);
    if (validate.error) {
      return next(new ErrorResponse("Validation error", 400, [validate.message]));
    }

    // Initial empty file placeholders
    const data: CreateCompanyDTO & { logo?: string; brochureUrl?: string } = {
      name,
      description,
      content,
      status,
      websiteUrl,
      contact,
      logo: "",
      brochureUrl: "",
    };

    // Create initial company record
    const company = await companyRepository.createCompany(data);
    if (company.error) {
      return next(new ErrorResponse("Creation failed", company.code!, [company.message]));
    }

    // Handle file uploads
    const logoFile = (req as any).files?.find((f: any) => f.fieldname === "logo");
    const brochureFile = (req as any).files?.find((f: any) => f.fieldname === "brochure");

    let logoUrl = "";
    let brochureUrl = "";

    if (logoFile) {
      logoUrl = await uploadService.uploadFile({
        stream: logoFile.stream,
        mimeType: logoFile.mimeType,
        originalFileName: logoFile.fileName,
        refId: company.data._id,
      });
    }

    if (brochureFile) {
      brochureUrl = await uploadService.uploadFile({
        stream: brochureFile.stream,
        mimeType: brochureFile.mimeType,
        originalFileName: brochureFile.fileName,
        refId: company.data._id,
      });
    }

    // Update file URLs
    await companyRepository.updateCompany(company.data._id, {
      logo: logoUrl,
      brochureUrl: brochureUrl,
    });

    // Clean final response
    // const sanitized = .toJSON();

    res.status(201).json({
      error: false,
      errors: [],
      data: {
        ...company.data,
        logo: logoUrl,
        brochureUrl: brochureUrl,
      },
      message: "Company created successfully.",
      status: 201,
    });
  }
);



/**
 * @name updateCompany
 * @description Updates a company
 * @route PATCH /companies/:id
 * @access Private
 */

export const updateCompany = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const companyId = req.params.id;

    const {
      name,
      description,
      content,
      status,
      websiteUrl,
      contact,
    }: UpdateCompanyDTO = req.body;

    // Validation
    const validate = await validationService.validateUpdateCompany(req.body);
    if (validate.error) {
      return next(new ErrorResponse("Validation error", 400, [validate.message]));
    }

    // const data = {
    //   name,
    //   description,
    //   content,
    //   status,
    //   websiteUrl,
    //   contact,
    // }

    // Fetch existing company
    const existing = await companyRepository.findById(companyId);
    if (!existing) {
      return next(new ErrorResponse("Company not found", 404, []));
    }

    // Extract existing URLs
    let logoUrl = existing.logo || '';
    let brochureUrl = existing.brochureUrl || '';

    const files = (req as any).files || [];
    const logoFile = files.find((f: any) => f.fieldname === "logo");
    const brochureFile = files.find((f: any) => f.fieldname === "brochure");

    // Handle logo upload
    if (logoFile) {
      logoUrl = await uploadService.uploadFile({
        stream: logoFile.stream,
        mimeType: logoFile.mimeType,
        originalFileName: logoFile.fileName,
        refId: existing._id.toString(),
      });
    }

    // Handle brochure upload
    if (brochureFile) {
      brochureUrl = await uploadService.uploadFile({
        stream: brochureFile.stream,
        mimeType: brochureFile.mimeType,
        originalFileName: brochureFile.fileName,
        refId: existing._id.toString(),
      });
    }

    // Update company
    const updated = await companyRepository.updateCompany(companyId, {
      name,
      description,
      content,
      status,
      websiteUrl,
      contact,
      logo: logoUrl,
      brochureUrl: brochureUrl,
    });

    if (updated.error) {
      return next(new ErrorResponse("Update failed", 500, [updated.message]));
    }

    // Clean response
    const sanitized = updated.data.toJSON();

    res.status(200).json({
      error: false,
      errors: [],
      data: sanitized,
      message: "Company updated successfully.",
      status: 200,
    });
  }
);




/**
 * @name getCompanyById
 * @description Get company by ID
 * @route GET /companies/:id
 * @access Public
 */
export const getCompanyById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const company = await companyRepository.findById(id, true);

    if (!company) {
      return next(new ErrorResponse("Error", 404, ["Company not found"]));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: company,
      message: "Company fetched successfully.",
      status: 200
    });
  }
);



/**
 * @name getCompanies
 * @description Get all companies
 * @route GET /companies
 * @access Public
 */
export const getCompanies = asyncHandler(
  async (_req: Request, res: Response) => {

    const result = await companyRepository.getCompanies();

    res.status(200).json({
      error: false,
      errors: [],
      data: result.data,
      message: "Companies fetched successfully.",
      status: 200
    });
  }
);

/**
 * @name deleteCompany
 * @description Deletes a company
 * @route DELETE /companies/:id
 * @access Private
 */
export const deleteCompany = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const company = await companyRepository.findById(id);
    if (!company) {
      return next(new ErrorResponse("Error", 404, ["Company not found"]));
    }

    const result = await companyRepository.deleteCompany(id);

    if (result.error) {
      return next(new ErrorResponse("Error", result.code!, [result.message]));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: result.data,
      message: result.message,
      status: 200
    });
  }
);
