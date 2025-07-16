import { IResult } from "../utils/interface.util";
import Transaction from "../models/Transaction.model";
import { Paystack } from "paystack-sdk";
import { config } from "../config/config";

export const paystack = new Paystack(config.testSecretkey);

class TransactionService {
  /**
   * @name verifyPurchase
   * @description Verifies a Paystack transaction for a store purchase.
   * @param reference The Paystack transaction reference
   * @returns A result with the transaction data or error info
   */
  async verifyPurchase(reference: string): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    try {
      const payment = await paystack.transaction.verify(reference);

      if (!payment.status || !payment.data) {
        return {
          error: true,
          message: payment.message || "Payment verification failed",
          code: 400,
          data: {},
        };
      }

      const trx = payment.data;
      const meta = trx.metadata;

      if (!meta || !meta.storeId || !meta.userId || !meta.category) {
        return {
          error: true,
          message: "Invalid or missing payment metadata",
          code: 400,
          data: {},
        };
      }

      const existing = await Transaction.findOne({ reference: trx.reference });
      if (existing) {
        return {
          error: false,
          message: "Transaction already recorded",
          code: 200,
          data: existing,
        };
      }

      const transaction = await Transaction.create({
        type: "purchase",
        medium: "store",
        resource: "store",
        entity: meta.storeId,
        reference: trx.reference,
        currency: trx.currency,
        providerRef: trx.id,
        providerName: "paystack",
        description: `${meta.category} purchase`,
        narration: `${meta.category} - ${meta.storeId}`,
        amount: trx.amount / 100,
        unitAmount: trx.amount,
        fee: trx.fees / 100,
        unitFee: trx.fees,
        status: trx.status,
        reason: trx.gateway_response,
        message: trx.message,
        providerData: [trx],
        metadata: [meta],
        channel: trx.channel,
        slug: trx.reference,
        card: trx.authorization,
        user: meta.userId,
      });

      result.message = "Transaction verified successfully";
      result.data = transaction;
      return result;
    } catch (err: any) {
      return {
        error: true,
        message: err?.message || "Something went wrong",
        code: err?.statusCode || 500,
        data: {},
      };
    }
  }
}

export default new TransactionService();
