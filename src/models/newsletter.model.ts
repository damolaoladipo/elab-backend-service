import mongoose, { Model, Schema } from "mongoose";
import { INewsletterDoc } from "../utils/interface.util";
import { DbModelsType } from "../utils/enums.util";

const NewsletterSchema = new Schema<INewsletterDoc>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    isSubsribed: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: "_version",
    toJSON: {
      transform(doc: any, ret) {
        ret.id = ret._id;
        delete ret.__v;
      },
    },
  }
);

const Newsletter: Model<INewsletterDoc> = mongoose.model<INewsletterDoc>(
  DbModelsType.NEWSLETTER,
  NewsletterSchema
);
export default Newsletter;
