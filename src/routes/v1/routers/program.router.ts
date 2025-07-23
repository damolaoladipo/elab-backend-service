import { Router } from "express";

import Protect from "../../../middlewares/checkAuth.mdw";
import { createProgram, deleteProgram, getProgram, getPrograms, getUserPrograms, updateProgram } from "../../../controllers/program.controller";


const programRouter = Router();

programRouter.get("/", getPrograms);
programRouter.get("/:slug", getProgram);
programRouter.post("/", Protect, createProgram);
programRouter.put("/:id", Protect, updateProgram);
programRouter.delete("/:id", Protect, deleteProgram);
programRouter.get("/user/:userId", Protect, getUserPrograms);

export default programRouter;
