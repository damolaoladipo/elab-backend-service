import express from "express";
import {
  getAllTransactions,
  getPaystackPublicKey,
  getTransaction,
  verifyStorePayment,
} from "../../../controllers/transaction.controller";
import Protect from "../../../middlewares/checkAuth.mdw";

const transactionRouter = express.Router();

transactionRouter.get("/start", getPaystackPublicKey);
transactionRouter.post("/verify", verifyStorePayment);
transactionRouter.get("/:id", Protect,  getTransaction);
transactionRouter.get("/", Protect, getAllTransactions);

export default transactionRouter;