import { Router } from "express";
import {
  createArchive,
  updateArchive,
  deleteArchive,
  getArchives,
  getArchiveById,
  getUserArchives
} from "../../../controllers/archive.controller";

const archiveRouter = Router({ mergeParams: true });

archiveRouter.post("/", createArchive);
archiveRouter.patch("/:id", updateArchive);
archiveRouter.delete("/:id", deleteArchive);
archiveRouter.get("/", getArchives);
archiveRouter.get("/:id", getArchiveById);
archiveRouter.get("/user/:userId", getUserArchives);

export default archiveRouter;
