import { Router } from "express";
import {
  createArchive,
  updateArchive,
  deleteArchive,
  getArchives,
  getArchiveById,
  getUserArchives,
  publishArchive
} from "../../../controllers/archive.controller";
import Protect from "../../../middlewares/checkAuth.mdw";
import uploadFile from "../../../middlewares/upload.mdw";

const archiveRouter = Router({ mergeParams: true });

archiveRouter.post("/", Protect, uploadFile, createArchive);
archiveRouter.patch("/:id/publish", Protect, publishArchive);
archiveRouter.put("/:id", Protect, uploadFile,updateArchive);
archiveRouter.delete("/:id", Protect, deleteArchive);
archiveRouter.get("/", Protect, getArchives);
archiveRouter.get("/:id", Protect, getArchiveById);
archiveRouter.get("/user/:userId", Protect, getUserArchives);

export default archiveRouter;
