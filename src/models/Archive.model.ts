import mongoose, { Schema, Model } from "mongoose";
import { IArchiveDoc } from "../utils/interface.util";
import { DbModelsType } from "../utils/enums.util";

const ArchiveSchema = new Schema<IArchiveDoc>(
  {
    title: { type: String, required: true },
    image: { type: String },
    content: { type: Schema.Types.Mixed }, // for IWysiwygContent
    link: { type: String },
    author: { type: String },
    resourceLink: { type: String },
    category: { type: String, required: true }, // news, insight, resource, press-release
    tags: { type: [String], default: [] },
    status: { type: String }, // published, draft, archived
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

const Archive: Model<IArchiveDoc> = mongoose.model<IArchiveDoc>(
  DbModelsType.ARCHIVE,
  ArchiveSchema
);

export default Archive;
