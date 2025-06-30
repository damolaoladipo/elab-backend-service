import { Types } from "mongoose";
import crypto from "crypto";
import Store from "../models/Store.model";
import { IStoreDoc, ITransactionDoc, IUserDoc } from "../utils/interface.util";
import ErrorResponse from "../utils/error.util";
import Transaction from "../models/Transaction.model";
import paystackService from "./paystack.service";


class TransactionService {
  async initiatePurchase(storeId: string, user: IUserDoc) {
    const store = await Store.findById(storeId) as IStoreDoc;
    if (!store || store.status !== "published") {
      throw new ErrorResponse("Store item not available for purchase", 404, []);
    }

    const amount = (store.discountedPrice ?? store.price) * 100;

    const response = await paystackService.initializePayment({
      amount,
      email: user.email,
      metadata: {
        storeId: store._id.toString(),
        userId: user._id.toString(),
        category: store.category,
      },
    });

    return {
      paymentUrl: response.data.authorization_url,
      reference: response.data.reference,
    };
  }

  async verifyPurchase(reference: string): Promise<ITransactionDoc> {
    const response = await paystackService.verifyTransaction(reference);
    const trx = response.data;
    const meta = trx.metadata;

    if (trx.status !== "success") {
      throw new ErrorResponse("Payment failed or incomplete", 400, []);
    }

    const existing = await Transaction.findOne({ reference: trx.reference });
    if (existing) return existing;

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
      user: new Types.ObjectId(meta.userId),
    });

    return transaction;
  }

  async handleWebhook(rawBody: Buffer, signature: string): Promise<void> {
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) {
      throw new ErrorResponse("Invalid webhook signature", 401, []);
    }

    const body = JSON.parse(rawBody.toString());
    const event = body.event;
    const data = body.data;
    const meta = data.metadata;

    if (event === "charge.success" && data.status === "success") {
      const existing = await Transaction.findOne({ reference: data.reference });
      if (existing) return;

      await Transaction.create({
        type: "purchase",
        medium: "store",
        resource: "store",
        entity: meta.storeId,
        reference: data.reference,
        currency: data.currency,
        providerRef: data.id,
        providerName: "paystack",
        description: `${meta.category} purchase`,
        narration: `${meta.category} - ${meta.storeId}`,
        amount: data.amount / 100,
        unitAmount: data.amount,
        fee: data.fees / 100,
        unitFee: data.fees,
        status: data.status,
        reason: data.gateway_response,
        message: data.message,
        providerData: [data],
        metadata: [meta],
        channel: data.channel,
        slug: data.reference,
        card: data.authorization,
        user: new Types.ObjectId(meta.userId),
      });
    }
  }
}

export default new TransactionService();
