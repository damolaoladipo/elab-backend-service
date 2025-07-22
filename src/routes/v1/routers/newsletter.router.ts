import { Router } from "express";
import {
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  getAllSubscribers,
  getSubscriber,
} from "../../../controllers/newsletter.controller";

const NewsletterRouter = Router();

NewsletterRouter.post("/subscribe", subscribeToNewsletter);
NewsletterRouter.post("/unsubscribe", unsubscribeFromNewsletter);
NewsletterRouter.get("/", getAllSubscribers);
NewsletterRouter.get("/:id", getSubscriber);

export default NewsletterRouter;
