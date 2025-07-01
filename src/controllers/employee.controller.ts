import { Request, Response, NextFunction } from "express";

import ErrorResponse from "../utils/error.util";
import employeeRepository from "../repositories/employee.repository";
import uploadService from "../services/upload.service";

export const createEmployee = asyncHandle(async (req, res, next) => {
  const userId = (req as any).user?.id;
  const { name, position } = req.body;

  const data = { name, position, user: userId, image: "" };
  const created = await employeeRepository.createEmployee(data);
  if (created.error) return next(new ErrorResponse("Failed", 500, [created.message]));

  let imageUrl = "";
  const imageFile = (req as any).files?.find((f: any) => f.fieldname === "image");
  if (imageFile) {
    imageUrl = await uploadService.uploadFile({
      stream: imageFile.stream,
      mimeType: imageFile.mimeType,
      originalFileName: imageFile.fileName,
      refId: created.data.id,
    });

    await employeeRepository.updateEmployee(created.data.id, { image: imageUrl });
  }

  res.status(201).json({
    error: false,
    errors: [],
    data: { ...created.data, image: imageUrl },
    message: "Employee created",
    status: 201,
  });
});

export const updateEmployee = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, position } = req.body;

  const existing = await employeeRepository.findById(id);
  if (existing.error) return next(new ErrorResponse("Not found", 404, [existing.message]));

  let imageUrl = existing.data.image;
  const imageFile = (req as any).files?.find((f: any) => f.fieldname === "image");
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
    position,
    image: imageUrl,
  });

  if (updated.error) return next(new ErrorResponse("Update failed", 500, [updated.message]));

  res.status(200).json({
    error: false,
    errors: [],
    data: updated.data,
    message: "Employee updated",
    status: 200,
  });
});

export const getEmployees = asyncHandler(async (_req, res) => {
  const result = await employeeRepository.getAll();
  res.status(200).json(result);
});

export const getEmployeeById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const result = await employeeRepository.findById(id);
  if (result.error) return next(new ErrorResponse("Not found", 404, [result.message]));
  res.status(200).json(result);
});

export const deleteEmployee = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const result = await employeeRepository.deleteEmployee(id);
  if (result.error) return next(new ErrorResponse("Not found", 404, [result.message]));
  res.status(200).json({
    error: false,
    errors: [],
    data: {},
    message: "Employee deleted",
    status: 200,
  });
});
