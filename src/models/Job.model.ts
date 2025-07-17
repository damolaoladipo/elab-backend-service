import mongoose, { Schema, Model } from "mongoose";
import { IJobDoc } from "../utils/interface.util";
import { DbModelsType } from "../utils/enums.util";

const JobSchema = new mongoose.Schema<IJobDoc>(
  {
    name: { type: String },
    email: { type: String },
    data: { type: Object },
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

JobSchema.set("toJSON", { virtuals: true, getters: true });

const Job: Model<IJobDoc> = mongoose.model<IJobDoc>(
  DbModelsType.JOB,
  JobSchema
);
export default Job;
