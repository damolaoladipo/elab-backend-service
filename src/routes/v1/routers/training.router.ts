import { Router } from "express";
import {
  createTraining,
  updateTraining,
  deleteTraining,
  getTrainings,
  getTraining,
  getUserTrainings
} from "../../../controllers/training.controller";
import Protect from "../../../middlewares/checkAuth.mdw";
import uploadFile from "../../../middlewares/upload.mdw";

const trainingRouter = Router();

// Public Routes
trainingRouter.get("/", getTrainings);
trainingRouter.get("/:slug", getTraining);
trainingRouter.get("/user/:userId", getUserTrainings);

// Admin/User Routes
trainingRouter.post("/", Protect, uploadFile, createTraining);
trainingRouter.put("/:trainingId", Protect, uploadFile, updateTraining);
trainingRouter.delete("/:trainingId", Protect, deleteTraining);

export default trainingRouter;
