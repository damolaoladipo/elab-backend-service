// models/Project.model.ts
import mongoose, { Schema, Model } from "mongoose";
import { IProjectDoc } from "../utils/interface.util";
import { DbModelsType } from "../utils/enums.util";
import slugify from "slugify";

const ProjectSchema = new Schema<IProjectDoc>(
  {
    title: { type: String, required: true },
    slug: { type: String, default: "" },
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

ProjectSchema.pre<IProjectDoc>("save", async function (next) {
  if (!this.isModified("title")) return next();

  const rawSlug = slugify(this.title, { lower: true, strict: true });

  let slug = rawSlug;
  let count = 1;

  while (await mongoose.models.Project.exists({ slug })) {
    slug = `${rawSlug}-${count}`;
    count++;
  }

  this.slug = slug;
  next();
});

const Project: Model<IProjectDoc> = mongoose.model<IProjectDoc>(
  DbModelsType.PROJECT,
  ProjectSchema
);
export default Project;
