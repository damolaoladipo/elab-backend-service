import { Router } from "express";
import {
  createProject,
  updateProject,
  deleteProject,
  getProjects,
  getProjectById,
  getUserProjects,
} from "../../../controllers/project.controller";
import uploadFile from "../../../middlewares/upload.mdw";
import Protect from "../../../middlewares/checkAuth.mdw";

const projectRouter = Router({ mergeParams: true });

projectRouter.post("/", Protect, uploadFile, createProject);
projectRouter.put("/:id", Protect, uploadFile, updateProject);
projectRouter.delete("/:id", Protect, deleteProject);
projectRouter.get("/", getProjects);
projectRouter.get("/:id", getProjectById);
projectRouter.get("/user/:userId", Protect, getUserProjects);

export default projectRouter;