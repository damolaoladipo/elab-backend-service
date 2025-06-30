import express from "express";
import {
  handleStoreWebhook,
  initiateStorePayment,
  verifyStorePayment,
} from "../../../controllers/transaction.controller";
import Protect from "../../../middlewares/checkAuth.mdw";

const transactionRouter = express.Router();

transactionRouter.post("/initiate", Protect, initiateStorePayment);
transactionRouter.get("/verify", Protect, verifyStorePayment);
transactionRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStoreWebhook
);

export default transactionRouter;
