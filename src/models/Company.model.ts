import mongoose, { Schema, Model } from "mongoose";
import { IVentureDoc } from "../utils/interface.util";
import { DbModelsType } from "../utils/enums.util";

const CompanySchema = new Schema<IVentureDoc>(
  {
    name: { type: String, required: true },
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

const Company: Model<IVentureDoc> = mongoose.model<IVentureDoc>(
  DbModelsType.COMPANY,
  CompanySchema
);
export default Company;
