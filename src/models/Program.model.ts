import mongoose, { Schema, Model } from "mongoose";
import { IProgramDoc } from "../utils/interface.util";
import { DbModelsType } from "../utils/enums.util";
import slugify from "slugify";

const ProgramSchema = new Schema<IProgramDoc>(
  {
    title: { type: String, required: true },
    slug: { type: String, default: "" },
    image: { type: String },
    description: { type: Schema.Types.Mixed, default: [] },
    joinUrl: { type: String },
    partnerUrl: { type: String },
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

ProgramSchema.pre<IProgramDoc>("save", async function (next) {
  if (!this.isModified("title")) return next();

  const rawSlug = slugify(this.title, { lower: true, strict: true });

  let slug = rawSlug;
  let count = 1;
  const Program = this.constructor as mongoose.Model<IProgramDoc>;

  while (await Program.exists({ slug })) {
    slug = `${rawSlug}-${count++}`;
  }

  this.slug = slug;
  next();
});

const Program: Model<IProgramDoc> = mongoose.model<IProgramDoc>(
  DbModelsType.PROGRAM,
  ProgramSchema
);

export default Program;
