import mongoose, { Schema, Model } from "mongoose";
import { IEmployeeDoc } from "../utils/interface.util";
import { DbModelsType } from "../utils/enums.util";
import slugify from "slugify";

const EmployeeSchema = new Schema<IEmployeeDoc>(
  {
    name: { type: String, required: true },
    slug: { type: String, default: ""},
    role: { type: String, required: true },
    image: { type: String }, // uploaded image URL
    status: {
      type: String,
    },
    socialLink: { type: String }, // optional social media link
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

EmployeeSchema.pre<IEmployeeDoc>("save", async function (next) {
  if (!this.isModified("name")) return next();

  const rawSlug = slugify(this.name, { lower: true, strict: true });

  let slug = rawSlug;
  let count = 1;

  const Employee = this.constructor as mongoose.Model<IEmployeeDoc>;
  while (await Employee.exists({ slug })) {
    slug = `${rawSlug}-${count}`;
    count++;
  }

  this.slug = slug;
  next();
});

const Employee: Model<IEmployeeDoc> = mongoose.model<IEmployeeDoc>(
  DbModelsType.EMPLOYEE,
  EmployeeSchema
);

export default Employee;
