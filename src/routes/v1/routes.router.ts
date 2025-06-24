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

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    error: false,
    errors: [],
    data: {
      name: "elab website API",
      version: "1.0.0",
    },
    message: "elab website api v1.0.0 is healthy",
    status: 200,
  });
});

export default router;
