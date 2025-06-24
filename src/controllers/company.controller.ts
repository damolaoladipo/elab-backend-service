import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import validationService from "../services/validate.service";
import { CreateCompanyDTO, UpdateCompanyDTO } from "../dtos/company.dto";
import companyRepository from "../repositories/company.repository";
import userReposirtory from "../repositories/user.reposirtory";


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
      logo,
      status,
      url,
      email,
      brochure,
      user
    }: CreateCompanyDTO = req.body;

    const validate = await validationService.validateCreateCompany(req.body);
    if (validate.error) {
      return next(new ErrorResponse("Error", 400, [validate.message]));
    }

    const data = {
      name,
      description,
      logo,
      status,
      url,
      email,
      brochure,
      user
    };

    const result = await companyRepository.createCompany(data);

    res.status(200).json({
      error: false,
      errors: [],
      data: result.data,
      message: result.message,
      status: 200
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
    const {
      name,
      description,
      logo,
      status,
      url,
      email,
      brochure,
      user
    }: UpdateCompanyDTO = req.body;

    const validate = await validationService.validateUpdateCompany(req.body);
    if (validate.error) {
      return next(new ErrorResponse("Error", 400, [validate.message]));
    }

    const data = {
      name,
      description,
      logo,
      status,
      url,
      email,
      brochure,
      user
    };

    const { id } = req.params;
    const result = await companyRepository.updateCompany(id, data);

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
 * @name getUserCompanies
 * @description Get all companies for a specific user
 * @route GET /users/:userId/companies
 * @access Public
 */
export const getUserCompanies = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    const user = await userReposirtory.findById(userId);
    if (!user) {
      return next(new ErrorResponse("Error", 404, ["User not found"]));
    }

    const result = await companyRepository.getUserCompanies(user._id);

    res.status(200).json({
      error: false,
      errors: [],
      data: result.data,
      message: "User companies fetched successfully.",
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
