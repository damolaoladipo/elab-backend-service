import mongoose, { Schema, Model } from "mongoose";
import { IProject } from "../utils/interface.util";
import { DbModelsType } from "../utils/enums.util";

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
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

const Project: Model<IProject> = mongoose.model<IProject>(
  DbModelsType.PROJECT,
  ProjectSchema
);
export default Project;
