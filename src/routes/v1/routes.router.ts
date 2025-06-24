import express, { Request, Response, NextFunction } from "express";
import authRoutes from "./routers/auth.router";
import eventRoutes from "./routers/event.router";
import projectRoutes from "./routers/project.router";
import resourceRoutes from "./routers/resource.router";

const router = express.Router();



router.use("/auth", authRoutes);
router.use("/event", eventRoutes);
router.use("/project", projectRoutes);
router.use("/resource", resourceRoutes);

export default router;
