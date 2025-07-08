import mongoose, { Schema, Model } from "mongoose";
import { IEventDoc } from "../utils/interface.util";
import { DbModelsType } from "../utils/enums.util";
import slugify from "slugify";

const EventSchema = new Schema<IEventDoc>(
  {
    title: { type: String, required: true },
    slug: { type: String, default: "" },
    image: { type: String },
    content: {
      type: Schema.Types.Mixed,
      default: {},
    },
    features: { type: Schema.Types.Mixed, default: {} },
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

EventSchema.pre<IEventDoc>("save", async function (next) {
  if (!this.isModified("title")) return next();

  const rawSlug = slugify(this.title, { lower: true, strict: true });

  let slug = rawSlug;
  let count = 1;

  const Event = this.constructor as mongoose.Model<IEventDoc>;
  while (await Event.exists({ slug })) {
    slug = `${rawSlug}-${count}`;
    count++;
  }

  this.slug = slug;
  next();
});

const Event: Model<IEventDoc> = mongoose.model<IEventDoc>(
  DbModelsType.EVENT,
  EventSchema
);
export default Event;
