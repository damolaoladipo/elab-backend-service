import { IResult } from "../utils/interface.util";
import Transaction from "../models/Transaction.model";
import { Paystack } from "paystack-sdk";
import { config } from "../config/config";
import storeRepository from "../repositories/store.repository";
import { v4 as uuidv4 } from "uuid";
import emailJobSchedular from "../jobs/scheduler/email.scheduler";
import { DateTime } from "luxon";
import { EmailDriver } from "../utils/enums.util";

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
      const txn = await paystack.transaction.verify(reference);

      if (txn.data?.status !== "success") {
        result.error = true;
        result.code = 400;
        result.message = txn.message;
        result.data = {};
        return result;
      }

      const existing = await Transaction.findOne({
        reference: txn.data.reference,
      });
      if (existing) {
        result.error = false;
        result.code = 200;
        result.message = "Transaction already recorded";
        result.data = existing;
        return result;
      }

      const referrer = txn.data.metadata?.referrer;

      let storeId: string | null = null;

      if (typeof referrer === "string") {
        const url = new URL(referrer);
        const parts = url.pathname.split("/");
        storeId = parts.pop() || null;
      }

      const purchasedItem = storeId;

      const store = await storeRepository.findStore(purchasedItem as string);
      if (!store) {
        throw new Error("Store item not found");
      }

      const txnRef = uuidv4();

      const transaction = await Transaction.create({
        type: "purchase",
        medium: txn.data.channel,
        resource: store.data.name,
        entity: store.data.id,
        reference: txnRef,
        currency: txn.data.currency,
        providerRef: txn.data.reference,
        providerName: "paystack",
        description: `Purchased of ${store.data.name}`,
        narration: `${store.data.name} purchase`,
        amount: txn.data.amount / 100,
        unitAmount: txn.data.amount,
        fee: txn.data.fees / 100,
        unitFee: txn.data.fees,
        status: txn.data.status,
        reason: txn.data.gateway_response,
        message: txn.data.message,
        providerData: txn.data.customer,
        metadata: txn.data.metadata,
        channel: txn.data.channel,
        slug: store.data.slug,
        card: txn.data.authorization,
        user: txn.data.customer.first_name,
        transactionDate: txn.data.paid_at,
      });

      await emailJobSchedular.sendPaymentConfirmationEMail({
        user: {
          email: txn.data.customer.email,
          name: txn.data.customer.first_name,
        },
        template: "payment-confirmation",
        subject: "Your payment is confirmed",
        driver: EmailDriver.MAILTRAP,
        payload: {
          name: txn.data.customer.first_name,
          date: DateTime.now().toFormat("dd/MM/yyyy HH:mm"),
          desc: transaction.description,
          item: transaction.resource,
          totalAmount: new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(transaction.amount),
        },
      });

      result.message = "payment successful";
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
