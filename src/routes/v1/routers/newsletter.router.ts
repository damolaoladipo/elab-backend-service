import { Router } from "express";
import {
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  getAllSubscribers,
  getSubscriber,
} from "../../../controllers/newsletter.controller";

const newsletterRouter = Router();

newsletterRouter.post("/subscribe", subscribeToNewsletter);
newsletterRouter.post("/unsubscribe", unsubscribeFromNewsletter);
newsletterRouter.get("/", getAllSubscribers);
newsletterRouter.get("/:id", getSubscriber);

export default newsletterRouter;
