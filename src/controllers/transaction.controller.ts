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


//get one payment
// get all payments
// verify payments
