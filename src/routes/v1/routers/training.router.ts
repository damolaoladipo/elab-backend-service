import { Router } from "express";
import {
  createTraining,
  updateTraining,
  deleteTraining,
  getTrainings,
  getTraining,
  getUserTrainings
} from "../../../controllers/training.controller";

const trainingRouter = Router();

// Public Routes
trainingRouter.get("/", getTrainings);
trainingRouter.get("/:slug", getTraining);
trainingRouter.get("/user/:userId", getUserTrainings);

// Admin/User Routes
trainingRouter.post("/", createTraining);
trainingRouter.put("/:trainingId", updateTraining);
trainingRouter.delete("/:trainingId", deleteTraining);

export default trainingRouter;
