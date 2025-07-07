import mongoose, { Schema, Model } from "mongoose";
import { IArchiveDoc } from "../utils/interface.util";
import { DbModelsType } from "../utils/enums.util";
import slugify from "slugify";

const ArchiveSchema = new Schema<IArchiveDoc>(
  {
    title: { type: String, required: true },
    slug: { type: String, default: ""},
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

ArchiveSchema.pre<IArchiveDoc>("save", async function (next) {
  if (!this.isModified("title")) return next();

  const rawSlug = slugify(this.title, { lower: true, strict: true });

  let slug = rawSlug;
  let count = 1;

  while (await mongoose.models.Archive.exists({ slug })) {
    slug = `${rawSlug}-${count}`;
    count++;
  }

  this.slug = slug;
  next();
});

const Archive: Model<IArchiveDoc> = mongoose.model<IArchiveDoc>(
  DbModelsType.ARCHIVE,
  ArchiveSchema
);

export default Archive;
