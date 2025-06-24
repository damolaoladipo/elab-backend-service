import { Router } from "express";
import {
  createProject,
  updateProject,
  deleteProject,
  getProjects,
  getProjectById,
  getUserProjects,
} from "../../../controllers/project.controller";

const projectRouter = Router({ mergeParams: true });

projectRouter.post("/", createProject);
projectRouter.patch("/:id", updateProject);
projectRouter.delete("/:id", deleteProject);
projectRouter.get("/", getProjects);
projectRouter.get("/:id", getProjectById);
projectRouter.get("/user/:userId", getUserProjects);

export default projectRouter;
