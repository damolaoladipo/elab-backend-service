import { Request, Response, NextFunction } from "express";
import transactionService from "../services/transaction.service";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";

/**
 * @name getPaystackPublicKey
 * @description returns paystack public key
 * @route GET /paystack/public-key
 * @access public
 */
export const getPaystackPublicKey = asyncHandler(
  async (req: Request, res: Response) => {
    res.status(200).json({
      error: false,
      data: process.env.PAYSTACK_PUBLIC_KEY,
    });
  }
);

/**
 * @desc Initiate payment for a store item via Paystack
 * @route POST /api/payments/initiate
 * @access Private
 */
export const initiateStorePayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return next(new ErrorResponse("Error", 401, ["Unauthorized user"]));
    }
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
    if (!reference) {
      return next(
        new ErrorResponse("Transaction reference is required", 400, [])
      );
    }

    const transaction = await transactionService.verifyPurchase(
      reference as string
    );
    if (transaction.error) {
      return next(
        new ErrorResponse(transaction.message, transaction.code || 400, [])
      );
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: transaction,
      message: "Payment Successful",
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
