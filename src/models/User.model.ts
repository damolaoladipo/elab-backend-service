import mongoose, { Schema, Model } from "mongoose";
import { IUserDoc } from "../utils/interface.util";
import {
  AppChannel,
 DbModelsType,
  OtpType,
  PasswordType,
  UserType,
} from "../utils/enums.util";
import UserService from "../services/user.service";



const UserSchema = new Schema<IUserDoc>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: { type: String, required: true, default: "", select: false },
    passwordType: {
      type: String,
      enum: Object.values(PasswordType),
      default: PasswordType.USERGENERATED,
    },
    userType: {
      type: String,
      enum: Object.values(UserType),
    },

    avatar: { type: String },
   

    Otp: { type: String },
    OtpExpiry: {
      type: Number,
    },
    otpType: { type: String, enum: Object.values(OtpType) },
    accessToken: { type: String },
    accessTokenExpiry: { type: Date },

    isSuper: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    
    isActive: { type: Boolean, default: false },
    isActivated: { type: Boolean, default: false },
    isDeactivated: { type: Boolean, default: false },
    loginLimit: { type: Number, default: 5 },
    lockedUntil: { type: Date },
    lastLogin: { type: String },


    // Relationships
    role: { type: Schema.Types.ObjectId, ref:DbModelsType.ROLE, index: true },
  },
  {
    timestamps: true,
    versionKey: "_version",
    toJSON: {
      transform(doc: any, ret) {
        ret.id = ret._id;
        delete ret.__v;
        delete ret.password;
      },
    },
  }
);

UserSchema.index(
  { phoneNumber: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { phoneNumber: { $exists: true, $ne: null } },
  }
);

UserSchema.set("toJSON", { virtuals: true, getters: true });

UserSchema.pre<IUserDoc>("save", async function (next) {
  if (!this.isModified("password")) return next();
  await UserService.encryptUserPassword(this, this.password);
  next();
});

UserSchema.pre<IUserDoc>("insertMany", async function (next) {
  next();
});

const User: Model<IUserDoc> = mongoose.model<IUserDoc>(
 DbModelsType.USER,
  UserSchema
);

export default User;
