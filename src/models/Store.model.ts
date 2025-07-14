import mongoose, { Schema, Model } from "mongoose";
import { IStoreDoc } from "../utils/interface.util";
import { DbModelsType } from "../utils/enums.util";
import slugify from "slugify";

const StoreSchema = new Schema<IStoreDoc>(
  {
    name: { type: String, required: true },
    slug: { type: String, default: "" },
    price: { type: Number, required: true },
    discountedPrice: { type: Number },
    image: { type: String },
    category: { type: String, required: true },
    author: { type: String },
    excerpt: { type: String },
    description: { type: String },
    url: { type: String },
    status: { type: String },
    color: { type: [String] },
    pageCount: { type: Number },
    size: { type: [String] },


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

StoreSchema.pre<IStoreDoc>("save", async function (next) {
  if (!this.isModified("name")) return next();

  const rawSlug = slugify(this.name, { lower: true, strict: true });

  let slug = rawSlug;
  let count = 1;

  const Store = this.constructor as mongoose.Model<IStoreDoc>;
  while (await Store.exists({ slug })) {
    slug = `${rawSlug}-${count}`;
    count++;
  }

  this.slug = slug;
  next();
});

const Store: Model<IStoreDoc> = mongoose.model<IStoreDoc>(
  DbModelsType.STORE,
  StoreSchema
);

export default Store;
