import mongoose, { Schema, Model } from "mongoose";
import { IEventDoc } from "../utils/interface.util";
import { DbModelsType } from "../utils/enums.util";

const EventSchema = new Schema<IEventDoc>(
  {
    title: { type: String, required: true },
    image: { type: String },
    content: {
      type: { type: String },
      content: String,
      level: Number,
      language: String,
      src: String,
      alt: String,
      href: String,
      items: [String],
    },
    features: { type: [String], default: [] },
    joinUrl: { type: String },
    planUrl: { type: String },
    sponsorUrl: { type: String },
    communityUrl: { type: String },
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

const Event: Model<IEventDoc> = mongoose.model<IEventDoc>(
  DbModelsType.EVENT,
  EventSchema
);
export default Event;
