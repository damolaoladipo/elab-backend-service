import { Router } from "express";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getEventById,
  getUserEvents,
} from "../../../controllers/event.controller";

const eventRouter = Router({ mergeParams: true });

eventRouter.post("/", createEvent);
eventRouter.put("/:id", updateEvent);
eventRouter.delete("/:id", deleteEvent);
eventRouter.get("/", getEvents);
eventRouter.get("/:id", getEventById);
eventRouter.get("/user/:userId", getUserEvents);

export default eventRouter;
