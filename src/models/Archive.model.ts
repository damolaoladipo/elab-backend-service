import mongoose, { Schema, Model } from "mongoose";
import { IArchive } from "../utils/interface.util";
import { DbModelsType } from "../utils/enums.util";

const ArchiveSchema = new Schema<IArchive>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    excerpt: { type: String },
    description: { type: String },
    link: { type: String },
    content: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    tags: { type: [String], default: [] },
    type: { type: String, required: true },
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

const Archive: Model<IArchive> = mongoose.model<IArchive>(
  DbModelsType.ARCHIVE,
  ArchiveSchema
);
export default Archive;
