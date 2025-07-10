import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import validationService from "../services/validate.service";
import { CreateCompanyDTO, UpdateCompanyDTO } from "../dtos/company.dto";
import companyRepository from "../repositories/company.repository";
import uploadService from "../services/upload.service";
import { generateSlug } from "../utils/helper.util";
import { IVentureDoc } from "../utils/interface.util";

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
      status,
      websiteUrl,
      contact,
      brochureUrl,
    }: CreateCompanyDTO = req.body;

    const validate = await validationService.validateCreateCompany(req.body);
    if (validate.error) {
      return next(new ErrorResponse(validate.message, 400, []));
    }

    // Initial empty file placeholders
    const data: CreateCompanyDTO & { logo?: string } = {
      name,
      description,
      status,
      websiteUrl,
      contact,
      brochureUrl,
      logo: "",
    };

    // Create initial company record
    const company = await companyRepository.createCompany(data);
    if (company.error) {
      return next(new ErrorResponse(company.message, company.code!, []));
    }

    // Handle file uploads
    const logoFile = (req as any).files?.find(
      (f: any) => f.fieldname === "logo"
    );

    let logoUrl = "";

    if (logoFile) {
      logoUrl = await uploadService.uploadFile({
        stream: logoFile.stream,
        mimeType: logoFile.mimeType,
        originalFileName: logoFile.fileName,
        refId: company.data._id,
      });
    }

    // Update file URLs
    await companyRepository.updateCompany(company.data._id, {
      logo: logoUrl,
    });

    res.status(201).json({
      error: false,
      errors: [],
      data: {
        ...company.data,
        logo: logoUrl,
      },
      message: "Company created successfully.",
      status: 201,
    });
  }
);

/**
 * @name getCompany
 * @description Get company by slug or ID
 * @route GET /companies/:slug
 * @access Public
 */
export const getCompany = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;

    const company = await companyRepository.findCompany(slug);

    if (company.error) {
      return next(new ErrorResponse(company.message, company.code!, []));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: company.data,
      message: company.message,
      status: company.code,
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
    const userId = (req as any).user?.id;
    if (!userId) {
      return next(new ErrorResponse("Unauthorized", 401, []));
    }

    const companyId = req.params.id;

    const {
      name,
      description,
      brochureUrl,
      status,
      websiteUrl,
      contact,
    }: UpdateCompanyDTO = req.body;

    const files = (req as any).files || [];
    const logoFile = files.find((f: any) => f.fieldname === "logo");

    const hasBodyUpdate =
      name || description || brochureUrl || status || websiteUrl || contact;
    const hasFileUpdate = !!logoFile;

    if (!hasBodyUpdate && !hasFileUpdate) {
      return next(new ErrorResponse("update data is empty", 400, []));
    }

    // Validate body if body fields exist
    if (hasBodyUpdate) {
      const validate = await validationService.validateUpdateCompany(req.body);
      if (validate.error) {
        return next(new ErrorResponse(validate.message, 400, []));
      }
    }

    const existing = await companyRepository.findCompany(companyId);
    if (!existing || existing.error) {
      return next(new ErrorResponse("Company not found", 404, []));
    }

    const updatePayload: Partial<IVentureDoc> = {};

    if (name && name !== existing.data.name) {
      updatePayload.name = name;

      const slug = await generateSlug({
        input: name,
        slugExistsFn: companyRepository.slugExists.bind(companyRepository),
      });

      updatePayload.slug = slug;
    }

    if (description && description !== existing.data.description) {
      updatePayload.description = description;
    }

    if (status && status !== existing.data.status) {
      updatePayload.status = status;
    }

    if (websiteUrl && websiteUrl !== existing.data.websiteUrl) {
      updatePayload.websiteUrl = websiteUrl;
    }

    if (contact && contact !== existing.data.contact) {
      updatePayload.contact = contact;
    }

    if (brochureUrl && brochureUrl !== existing.data.brochureUrl) {
      updatePayload.brochureUrl = brochureUrl;
    }

    if (logoFile) {
      const logoUrl = await uploadService.uploadFile({
        stream: logoFile.stream,
        mimeType: logoFile.mimeType,
        originalFileName: logoFile.fileName,
        refId: existing.data._id,
      });

      if (logoUrl && logoUrl !== existing.data.logo) {
        updatePayload.logo = logoUrl;
      }
    }

    const updated = await companyRepository.updateCompany(companyId, updatePayload);
    if (updated.error) {
      return next(new ErrorResponse(updated.message, updated.code!, []));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: updated.data,
      message: "Company updated successfully.",
      status: 200,
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
      status: 200,
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

    const company = await companyRepository.findCompany(id);
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
      status: 200,
    });
  }
);
