import mongoose, { Schema, Model } from "mongoose";
import { ITrainingDoc } from "../utils/interface.util";
import { DbModelsType } from "../utils/enums.util";
import slugify from "slugify";

const TrainingSchema = new Schema<ITrainingDoc>(
  {
    title: { type: String },
    slug: { type: String, default: "" },
    subtitle: { type: String },
    image: { type: String },
    description: { type: Schema.Types.Mixed, default: [] },
    outcome: { type: Schema.Types.Mixed, default: [] },
    cta: { type: String },
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

TrainingSchema.pre<ITrainingDoc>("save", async function (next) {
  if (!this.isModified("title")) return next();

  const rawSlug = slugify(this.title, { lower: true, strict: true });

  let slug = rawSlug;
  let count = 1;
  const Training = this.constructor as mongoose.Model<ITrainingDoc>;

  while (await Training.exists({ slug })) {
    slug = `${rawSlug}-${count++}`;
  }

  this.slug = slug;
  next();
});

const Training: Model<ITrainingDoc> = mongoose.model<ITrainingDoc>(
  DbModelsType.TRAINING,
  TrainingSchema
);

export default Training;
