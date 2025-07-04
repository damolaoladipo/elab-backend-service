import { Router } from "express";
import {
  createEmployee,
  updateEmployee,
  getEmployees,
  getEmployeeById,
  deleteEmployee
} from "../../../controllers/employee.controller";
import Protect from "../../../middlewares/checkAuth.mdw";
import uploadFile from "../../../middlewares/upload.mdw";

const employeeRouter = Router({ mergeParams: true });

employeeRouter.post("/", Protect, uploadFile, createEmployee);
employeeRouter.put("/:id", Protect, uploadFile, updateEmployee);
employeeRouter.delete("/:id", Protect, deleteEmployee);
employeeRouter.get("/", getEmployees);
employeeRouter.get("/:id", getEmployeeById);

export default employeeRouter;