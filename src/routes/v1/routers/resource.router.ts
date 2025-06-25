import { Router } from "express";
import {
  createResource,
  updateResource,
  deleteResource,
  getResources,
  getResourceById,
  getUserResources
} from "../../../controllers/resource.controller";
import Protect from "../../../middlewares/checkAuth.mdw";
import uploadFile from "../../../middlewares/upload.mdw";


/**
 * @name resourceRouter
 * @description Router for resource endpoints
 */
const resourceRouter = Router({ mergeParams: true });

resourceRouter.post("/", Protect, uploadFile, createResource);
resourceRouter.patch("/:id", Protect, updateResource);
resourceRouter.delete("/:id",Protect, deleteResource);
resourceRouter.get("/", Protect, getResources);
resourceRouter.get("/:id", Protect, getResourceById);
resourceRouter.get("/user/:userId", Protect, getUserResources);

export default resourceRouter;
