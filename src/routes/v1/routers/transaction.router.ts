import express from "express";
import {
  getPaystackPublicKey,
  
  verifyStorePayment,
} from "../../../controllers/transaction.controller";
import Protect from "../../../middlewares/checkAuth.mdw";

const transactionRouter = express.Router();

transactionRouter.get("/start", getPaystackPublicKey);
transactionRouter.post("/verify", verifyStorePayment);

export default transactionRouter;