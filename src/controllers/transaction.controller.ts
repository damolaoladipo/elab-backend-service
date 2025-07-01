import { Request, Response, NextFunction } from "express";
import transactionService from "../services/transaction.service";
import asyncHandler from "../middlewares/async.mdw";

/**
 * @desc Initiate payment for a store item via Paystack
 * @route POST /api/payments/initiate
 * @access Private
 */
export const initiateStorePayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    const { storeId } = req.body;

    const result = await transactionService.initiatePurchase(storeId, user);

    res.status(200).json({
      error: false,
      errors: [],
      data: result,
      message: "Payment initialized successfully",
      status: 200,
    });
  }
);

/**
 * @desc Verify a completed Paystack transaction
 * @route GET /api/payments/verify?reference=ref_123
 * @access Private
 */
export const verifyStorePayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { reference } = req.query;

    const transaction = await transactionService.verifyPurchase(
      reference as string
    );

    res.status(200).json({
      error: false,
      errors: [],
      data: transaction,
      message: "Payment verified successfully",
      status: 200,
    });
  }
);

/**
 * @desc Handle Paystack webhook for store purchases
 * @route POST /api/payments/webhook
 * @access Public (Paystack only)
 */
export const handleStoreWebhook = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const rawBody = req.body as Buffer;
    const signature = req.headers["x-paystack-signature"] as string;

    await transactionService.handleWebhook(rawBody, signature);

    res.status(200).json({
      error: false,
      errors: [],
      data: null,
      message: "Webhook processed successfully",
      status: 200,
    });
  }
);
