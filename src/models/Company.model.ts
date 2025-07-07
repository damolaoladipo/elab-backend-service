import mongoose, { Schema, Model } from "mongoose";
import { IVentureDoc } from "../utils/interface.util";
import { DbModelsType } from "../utils/enums.util";
import slugify from "slugify";

const CompanySchema = new Schema<IVentureDoc>(
  {
    name: { type: String, required: true },
    slug: { type: String, default: ""},
    description: { type: Schema.Types.Mixed }, // for IWysiwygContent
    logo: { type: String },
    status: { type: String },
    
    websiteUrl: { type: String },
    brochureUrl: { type: String },
    contact: { type: String },

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

CompanySchema.pre<IVentureDoc>("save", async function (next) {
  if (!this.isModified("name")) return next();

  const rawSlug = slugify(this.name, { lower: true, strict: true });

  let slug = rawSlug;
  let count = 1;

  while (await mongoose.models.Company.exists({ slug })) {
    slug = `${rawSlug}-${count}`;
    count++;
  }

  this.slug = slug;
  next();
});

const Company: Model<IVentureDoc> = mongoose.model<IVentureDoc>(
  DbModelsType.COMPANY,
  CompanySchema
);
export default Company;
