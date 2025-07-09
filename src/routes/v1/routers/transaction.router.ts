import express from "express";
import {
  getPaystackPublicKey,
  handleStoreWebhook,
  verifyStorePayment,
} from "../../../controllers/transaction.controller";
import Protect from "../../../middlewares/checkAuth.mdw";

const transactionRouter = express.Router();

transactionRouter.post("/start", Protect, getPaystackPublicKey);
transactionRouter.get("/verify", Protect, verifyStorePayment);
transactionRouter.post("/webhook", handleStoreWebhook);

export default transactionRouter;