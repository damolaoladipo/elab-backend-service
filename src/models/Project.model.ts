// models/Project.model.ts
import mongoose, { Schema, Model } from "mongoose";
import { IProjectDoc } from "../utils/interface.util";
import { DbModelsType } from "../utils/enums.util";

const ProjectSchema = new Schema<IProjectDoc>(
  {
    title: { type: String, required: true },
    image: { type: String },
    content: { type: Object, required: true },
    websiteUrl: { type: String },
    volunteerUrl: { type: String },
    partnerUrl: { type: String },
    sponsorUrl: { type: String },
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

const Project: Model<IProjectDoc> = mongoose.model<IProjectDoc>(
  DbModelsType.PROJECT,
  ProjectSchema
);
export default Project;
