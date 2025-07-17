import mongoose, { Schema, Model } from "mongoose";
import { ITransactionDoc } from "../utils/interface.util";
import { DbModelsType, TransactionsType } from "../utils/enums.util";
import slugify from "slugify";

const TransactionSchema = new Schema<ITransactionDoc>(
  {
    type: {
      type: String,
      enum: Object.values(TransactionsType),
      index: true,
    },
    medium: { type: String },
    resource: { type: String },
    entity: { type: String },
    reference: { type: String, unique: true, required: true },
    currency: { type: String },
    providerRef: { type: String },
    providerName: { type: String },
    description: { type: String },
    narration: { type: String },
    amount: { type: Number, required: true },
    unitAmount: { type: Number, required: true }, // kobo unit * 100
    fee: { type: Number, required: true },
    unitFee: { type: Number, required: true }, // kobo unit * 100
    status: { type: String },
    reason: { type: String },
    message: { type: String },
    providerData: [{ type: Schema.Types.Mixed }],
    metadata: [{ type: Schema.Types.Mixed }],
    channel: { type: String },
    slug: { type: String },
    card: {
      authCode: { type: String, select: false },
      cardBin: { type: String },
      cardLast: { type: String },
      expiryMonth: { type: String },
      expiryYear: { type: String },
      cardPan: { type: String, select: false },
      token: { type: String },
      provider: { type: String },
    },

    // Relationships
    user: { type: String },
  },
  {
    timestamps: true,
    versionKey: "_versions",
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret.__v;
      },
    },
  }
);


const Transaction: Model<ITransactionDoc> = mongoose.model<ITransactionDoc>(
  DbModelsType.TRANSACTION,
  TransactionSchema
);

export default Transaction;
