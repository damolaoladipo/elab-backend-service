import express, { Request, Response, NextFunction } from "express";
import authRoutes from "./routers/auth.router";
import eventRoutes from "./routers/event.router";
import projectRoutes from "./routers/project.router";
import storeRoutes from "./routers/store.router";
import companyRoutes from "./routers/company.router";
import archiveRoutes from "./routers/archive.router";


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/archive", archiveRoutes)
router.use("/venture", companyRoutes)
router.use("/event", eventRoutes);
router.use("/project", projectRoutes);
router.use("/store", storeRoutes)

export default router;
