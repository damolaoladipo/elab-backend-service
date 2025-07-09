import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/error.util";
import employeeRepository from "../repositories/employee.repository";
import uploadService from "../services/upload.service";
import asyncHandler from "../middlewares/async.mdw";
import { CreateEmployeeDTO, UpdateEmployeeDTO } from "../dtos/employee.dto";
import { IEmployeeDoc } from "../utils/interface.util";
import { generateSlug } from "../utils/helper.util";

/**
 * @name createEmployee
 * @description Creates a new employee
 * @route POST /employees
 * @access Private
 */
export const createEmployee = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    const { name, role, socialLink }: CreateEmployeeDTO = req.body;

    const data = {
      name,
      role,
      user: userId,
      status: "active",
      socialLink,
      image: "",
    };

    const created = await employeeRepository.createEmployee(data);
    if (created.error)
      return next(new ErrorResponse("Failed", 500, [created.message]));

    let imageUrl = "";
    const imageFile = (req as any).files?.find(
      (f: any) => f.fieldname === "image"
    );

    if (imageFile) {
      imageUrl = await uploadService.uploadFile({
        stream: imageFile.stream,
        mimeType: imageFile.mimeType,
        originalFileName: imageFile.fileName,
        refId: created.data.id,
      });

      await employeeRepository.updateEmployee(created.data.id, {
        image: imageUrl,
      });
    }

    res.status(201).json({
      error: false,
      errors: [],
      data: { ...created.data, image: imageUrl },
      message: "Employee created",
      status: 201,
    });
  }
);

/**
 * @name getEmpluyee
 * @description Get employee by slug
 * @param {string} slug OR Id - The slug or ID of the emplyee
 * @route GET /emplyee/slug/:slug
 * @access Public
 */
export const getEmployee = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;

    const employee = await employeeRepository.findEmployee(slug);
    if (employee.error) {
      return next(
        new ErrorResponse("Failed", employee.code!, [employee.message])
      );
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: employee.data,
      message: employee.message,
      status: employee.code,
    });
  }
);

/**
 * @name updateEmployee
 * @description Updates an existing employee
 * @route PATCH /employees/:id
 * @access Private
 * @param {string} id - The ID of the employee to update
 * @param {UpdateEmployeeDTO} body - The data to update the employee with
 * */

export const updateEmployee = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    if (!userId) {
      return next(new ErrorResponse("Unauthorized", 401, []));
    }
    const { employeeId } = req.params;
    if (!employeeId) {
      return next(new ErrorResponse("Employee ID is required", 400, []));
    }

    const { name, role, socialLink, status }: UpdateEmployeeDTO = req.body;

    // Fetch existing company
    const existing = await employeeRepository.findEmployee(employeeId);
    if (!existing) {
      return next(new ErrorResponse("Company not found", 404, []));
    }

    const updatePayload: Partial<IEmployeeDoc> = {};

    if (name && name !== existing.data.name) {
      updatePayload.name = name;

      const slug = await generateSlug({
        input: name,
        slugExistsFn: employeeRepository.slugExists.bind(employeeRepository),
      });

      updatePayload.slug = slug;
    }

    if (role && role !== existing.data.role) {
      updatePayload.role = role;
    }
    if (socialLink && socialLink !== existing.data.socialLink) {
      updatePayload.socialLink = socialLink;
    }
    if (status && status !== existing.data.status) {
      updatePayload.status = status;
    }

    let imageUrl = existing.data.image;

    const imageFile = (req as any).files?.find(
      (f: any) => f.fieldname === "image"
    );
    if (imageFile) {
      imageUrl = await uploadService.uploadFile({
        stream: imageFile.stream,
        mimeType: imageFile.mimeType,
        originalFileName: imageFile.fileName,
        refId: existing.data.id,
      });

      if (imageUrl && imageUrl !== existing.data.image) {
        updatePayload.image = imageUrl;
      }
    }

    const updated = await employeeRepository.updateEmployee(
      employeeId,
      updatePayload
    );
    if (updated.error) {
      return next(new ErrorResponse(updated.message, updated.code, []));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: updated.data,
      message: "Employee updated successfully.",
      status: 200,
    });
  }
);

/**
 * @name getEmployees
 * @description Fetches all employees
 * @route GET /employees
 * @access Public
 */
export const getEmployees = asyncHandler(
  async (_req: Request, res: Response) => {
    const result = await employeeRepository.getEmployees();
    res.status(200).json(result);
  }
);

/**
 * @name getEmployeeById
 * @description Fetches an employee by ID
 * @route GET /employees/:id
 * @access Public
 * @param {string} id - The ID of the employee to fetch
 */
export const getEmployeeById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(new ErrorResponse("ID is required", 400, ["Invalid ID"]));
    }
    const employee = await employeeRepository.findEmployee(id);
    if (!employee) {
      return next(new ErrorResponse("Employee not found", 404, []));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: employee,
      message: "Employee fetched successfully.",
      status: 200,
    });
  }
);

/**
 * @name deleteEmployee
 * @description Deletes an employee
 * @route DELETE /employees/:id
 * @access Private
 * @param {string} id - The ID of the employee to delete
 */
export const deleteEmployee = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await employeeRepository.deleteEmployee(id);
    if (result.error)
      return next(new ErrorResponse("Not found", 404, [result.message]));

    res.status(200).json({
      error: false,
      errors: [],
      data: {},
      message: "Employee deleted",
      status: 200,
    });
  }
);
