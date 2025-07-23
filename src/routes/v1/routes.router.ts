import express, { Request, Response, NextFunction } from "express";
import authRoutes from "./routers/auth.router";
import eventRoutes from "./routers/event.router";
import projectRoutes from "./routers/project.router";
import storeRoutes from "./routers/store.router";
import companyRoutes from "./routers/company.router";
import archiveRoutes from "./routers/archive.router";
import employeeRoutes from "./routers/employee.router";
import transactionRoutes from "./routers/transaction.router";
import newsletterRoutes from "./routers/newsletter.router";
import programRoutes from "./routers/program.router";


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/archive", archiveRoutes)
router.use("/employee", employeeRoutes)
router.use("/event", eventRoutes);
router.use("/project", projectRoutes);
router.use("/store", storeRoutes)
router.use("/venture", companyRoutes)
router.use("/payment", transactionRoutes)
router.use("/newsletter", newsletterRoutes)
router.use("/program", programRoutes)

export default router;
