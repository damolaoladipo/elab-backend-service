import { Router } from "express";
import {
  createProject,
  updateProject,
  deleteProject,
  getProjects,
  getUserProjects,
  getProject,
} from "../../../controllers/project.controller";
import uploadFile from "../../../middlewares/upload.mdw";
import Protect from "../../../middlewares/checkAuth.mdw";

const projectRouter = Router({ mergeParams: true });

projectRouter.post("/", Protect, uploadFile, createProject);
projectRouter.put("/:id", Protect, uploadFile, updateProject);
projectRouter.delete("/:id", Protect, deleteProject);
projectRouter.get("/", getProjects);
projectRouter.get("/:slug", getProject);
projectRouter.get("/user/:userId", Protect, getUserProjects);

export default projectRouter;