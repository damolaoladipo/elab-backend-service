import { Router } from "express";
import {
  createResource,
  updateResource,
  deleteResource,
  getResources,
  getResourceById,
  getUserResources
} from "../../../controllers/resource.controller";


/**
 * @name resourceRouter
 * @description Router for resource endpoints
 */
const resourceRouter = Router({ mergeParams: true });

resourceRouter.post("/", createResource);
resourceRouter.patch("/:id", updateResource);
resourceRouter.delete("/:id", deleteResource);
resourceRouter.get("/", getResources);
resourceRouter.get("/:id", getResourceById);
resourceRouter.get("/user/:userId", getUserResources);

export default resourceRouter;
