import mongoose, { Schema, Model } from "mongoose";
import { IEmployeeDoc } from "../utils/interface.util";
import { DbModelsType } from "../utils/enums.util";

const EmployeeSchema = new Schema<IEmployeeDoc>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    image: { type: String }, // uploaded image URL
    status: {
      type: String,
    },
    socialLink: { type: String }, // optional social media link
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

const Employee: Model<IEmployeeDoc> = mongoose.model<IEmployeeDoc>(
  DbModelsType.EMPLOYEE,
  EmployeeSchema
);

export default Employee;
