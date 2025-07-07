import mongoose, { Schema, Model } from "mongoose";
import { IStoreDoc } from "../utils/interface.util";
import { DbModelsType } from "../utils/enums.util";

const StoreSchema = new Schema<IStoreDoc>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    discountedPrice: { type: Number },
    image: { type: String },
    category: { type: String, required: true },
    author: { type: String },
    excerpt: { type: String },
    description: { type: String },
    url: { type: String, required: true },
    status: { type: String },
    color: { type: String },
    pageCount: { type: Number },
    size: { type: String },

    user: { type: Schema.Types.ObjectId, ref: DbModelsType.USER, index: true },
  },
  {
    timestamps: true,
    versionKey: "_version",
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret.__v;
      },
    },
  }
);

const Store: Model<IStoreDoc> = mongoose.model<IStoreDoc>(
  DbModelsType.STORE,
  StoreSchema
);

export default Store;
