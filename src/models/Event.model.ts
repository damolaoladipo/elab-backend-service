import mongoose, { Schema, Model } from "mongoose";
import { IEventDoc } from "../utils/interface.util";
import { DbModelsType } from "../utils/enums.util";

const EventSchema = new Schema<IEventDoc>(
  {
    name: { type: String, required: true },
    eventType: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    features: { type: [String], default: [] },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
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
