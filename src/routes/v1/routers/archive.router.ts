import { Router } from "express";
import {
  createArchive,
  updateArchive,
  deleteArchive,
  getArchives,
  getArchiveById,
  getUserArchives,
  publishArchive,
  unpublishArchive,
  getArchiveBySlug
} from "../../../controllers/archive.controller";
import Protect from "../../../middlewares/checkAuth.mdw";
import uploadFile from "../../../middlewares/upload.mdw";
import authRouter from "./auth.router";

const archiveRouter = Router({ mergeParams: true });

archiveRouter.post("/", Protect, uploadFile, createArchive);
archiveRouter.patch("/:id/publish", Protect, publishArchive);
archiveRouter.patch("/:id/unpublish", Protect, unpublishArchive);
archiveRouter.put("/:id", Protect, uploadFile,updateArchive);
archiveRouter.delete("/:id", Protect, deleteArchive);
archiveRouter.get("/", getArchives);
authRouter.get("/:slug", getArchiveBySlug);
archiveRouter.get("/:id", getArchiveById);
archiveRouter.get("/user/:userId", Protect, getUserArchives);

export default archiveRouter;
