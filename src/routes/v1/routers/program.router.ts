import { Router } from "express";

import Protect from "../../../middlewares/checkAuth.mdw";
import { createProgram, deleteProgram, getProgram, getPrograms, getUserPrograms, updateProgram } from "../../../controllers/program.controller";
import uploadFile from "../../../middlewares/upload.mdw";


const programRouter = Router();

programRouter.get("/", getPrograms);
programRouter.get("/:slug", getProgram);
programRouter.post("/", Protect, uploadFile, createProgram);
programRouter.put("/:id", Protect, uploadFile, updateProgram);
programRouter.delete("/:id", Protect, deleteProgram);
programRouter.get("/user/:userId", Protect, getUserPrograms);

export default programRouter;