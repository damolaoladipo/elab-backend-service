import { Request, Response, NextFunction } from "express";
import transactionService from "../services/transaction.service";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import transactionRepository from "../repositories/transaction.repository";

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

/**
 * @name getTransaction
 * @description Get transaction by slug
 * @param {string} slug OR Id - The slug or ID of the emplyee
 * @route GET /emplyee/slug/:slug
 * @access Public
 */
export const getTransaction = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;

    const transaction = await transactionRepository.findTransaction(slug);
    if (transaction.error) {
      return next(
        new ErrorResponse(transaction.message, transaction.code!, [])
      );
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: transaction.data,
      message: transaction.message,
      status: transaction.code,
    });
  }
);

/**
 * @name gettransactions
 * @description Fetches all transactions
 * @route GET /transactions
 * @access Public
 */
export const getAllTransactions = asyncHandler(
  async (_req: Request, res: Response) => {
    const result = await transactionRepository.getTransactions();

    res.status(200).json({
      error: false,
      errors: [],
      data: result,
      message: "all transactions fetched",
      status: 200,
    });
  }
);