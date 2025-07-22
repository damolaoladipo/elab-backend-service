// routes/newsletter.routes.ts
import { Router } from "express";
import {
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  getAllSubscribers,
  getSubscriberById,
} from "../../../controllers/newsletter.controller";

const NewsletterRouter = Router();

NewsletterRouter.post("/subscribe", subscribeToNewsletter);
NewsletterRouter.post("/unsubscribe", unsubscribeFromNewsletter);
NewsletterRouter.get("/", getAllSubscribers);
NewsletterRouter.get("/:id", getSubscriberById);

export default NewsletterRouter;
