import { Router } from "express";


import {
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanies,
  getCompany,
} from "../../../controllers/company.controller";
import Protect from "../../../middlewares/checkAuth.mdw";
import uploadFile from "../../../middlewares/upload.mdw";

const companyRouter = Router({ mergeParams: true });

companyRouter.post("/", Protect, uploadFile, createCompany);
companyRouter.put("/:id", Protect, uploadFile, updateCompany);
companyRouter.delete("/:id", Protect, deleteCompany);
companyRouter.get("/", getCompanies);
companyRouter.get("/:slug", getCompany);

export default companyRouter;