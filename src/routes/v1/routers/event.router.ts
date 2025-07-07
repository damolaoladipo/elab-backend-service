import { Router } from "express";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getEventById,
  getUserEvents,
  getEventBySlug,
} from "../../../controllers/event.controller";
import uploadFile from "../../../middlewares/upload.mdw";
import Protect from "../../../middlewares/checkAuth.mdw";

const eventRouter = Router({ mergeParams: true });

eventRouter.post("/", Protect, uploadFile, createEvent);
eventRouter.put("/:id", Protect, uploadFile, updateEvent);
eventRouter.delete("/:id", Protect, deleteEvent);
eventRouter.get("/", getEvents);
eventRouter.get("/:id", getEventById);
eventRouter.get("/:slug", getEventBySlug);
eventRouter.get("/user/:userId", Protect, getUserEvents);

export default eventRouter;
