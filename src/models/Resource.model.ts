import mongoose, { Schema, Model } from "mongoose";
import { IResource } from "../utils/interface.util";
import { DbModelsType } from "../utils/enums.util";

const ResourceSchema = new Schema<IResource>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    resource: { type: String, required: true },
    type: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    tags: { type: [String], default: [] },
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

const Resource: Model<IResource> = mongoose.model<IResource>(
  DbModelsType.RESOURCE,
  ResourceSchema
);
export default Resource;
