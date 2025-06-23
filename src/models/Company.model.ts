import mongoose, { Schema, Model } from "mongoose";
import { ICompany } from "../utils/interface.util";
import { DbModelsType } from "../utils/enums.util";

const CompanySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    logo: { type: String, required: true },
    status: { type: String, required: true },
    url: { type: String, required: true },
    email: { type: String, required: true },
    brochure: { type: String, required: true },
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

const Company: Model<ICompany> = mongoose.model<ICompany>(
  DbModelsType.COMPANY,
  CompanySchema
);
export default Company;
