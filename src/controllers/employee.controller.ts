import { Request, Response, NextFunction } from "express";

import ErrorResponse from "../utils/error.util";
import employeeRepository from "../repositories/employee.repository";
import uploadService from "../services/upload.service";
import asyncHandler from "../middlewares/async.mdw";
import { CreateEmployeeDTO, UpdateEmployeeDTO } from "../dtos/employee.dto";

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

export const updateEmployee = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, role, socialLink, status }: UpdateEmployeeDTO = req.body;

    const existing = await employeeRepository.findById(id);
    if (!existing) return next(new ErrorResponse("Not found", 404, []));

    let imageUrl = existing.image;
    const imageFile = (req as any).files?.find(
      (f: any) => f.fieldname === "image"
    );
    if (imageFile) {
      imageUrl = await uploadService.uploadFile({
        stream: imageFile.stream,
        mimeType: imageFile.mimeType,
        originalFileName: imageFile.fileName,
        refId: id,
      });
    }

    const updated = await employeeRepository.updateEmployee(id, {
      name,
      role,
      socialLink,
      status,
      image: imageUrl,
    });

    if (updated.error)
      return next(new ErrorResponse("Update failed", 500, [updated.message]));

    res.status(200).json({
      error: false,
      errors: [],
      data: updated.data,
      message: "Employee updated",
      status: 200,
    });
  }
);

export const getEmployees = asyncHandler(
  async (_req: Request, res: Response) => {
    const result = await employeeRepository.getEmployees();
    res.status(200).json(result);
  }
);

export const getEmployeeById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(new ErrorResponse("ID is required", 400, ["Invalid ID"]));
    }
    const employee = await employeeRepository.findById(id);
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
