import { Document, ObjectId } from "mongoose";
import { AppChannel, EmailType, OtpType, PasswordType, TransactionsType, UserType } from "./enums.util";

export type Nullable<T> = T | null;
export interface IRoleDoc extends Document {
  name: string;
  description: string;
  slug: string;
  scope?: string;
  scopeId?: string;

  // relationships
  permissions: Array<string>;
  users: Array<ObjectId | any>;

  // timestamps
  createdAt: string;
  updatedAt: string;
  _version: number;
  _id: ObjectId; 
  id: ObjectId;
}

export interface IPermissionDoc extends Document {
  action: string;
  description: string;

  // timestamps
  createdAt: string;
  updatedAt: string;
  _version: number;
  _id: ObjectId;
  id: ObjectId;
}

export interface IUserDoc extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordType: PasswordType; // encrypt this data
  userType: UserType;

  //user: string;
  phoneNumber: string;
  phoneCode: string;
  country: string;
  countryPhone: string;

  avatar: string;
  dateOfBirth: Date;
  gender: string;
  location: ILocationInfo;

  Otp: string;
  OtpExpiry: number;
  otpType: OtpType;
  accessToken: string;
  accessTokenExpiry: Date;

  isSuper: boolean;
  isAdmin: boolean;
  isUser: boolean;

  loginInfo: ILoginType;
  lastLogin: string;
  isActive: boolean;
  isActivated: boolean;
  isDeactivated: boolean;
  loginLimit: number;
  isLocked: boolean;
  lockedUntil: Nullable<Date>;
  twoFactorEnabled: boolean;

  // Notification Preferences
  // deviceToken: IDeviceToken;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };

  // relationships
  role: ObjectId | any;

  matchPassword: (password: string) => boolean;
  getAuthToken: () => string;

  // time stamps
  createdAt: Date;
  updatedAt: Date;
  _version: number;
  _id: ObjectId;
  id: ObjectId;
}


export interface IAdminDoc extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordType: PasswordType; // encrypt this data
  userType: UserType;
}

export interface ILoginType {
  ip: string;
  deviceType: string;
  platform: AppChannel
  deviceInfo?: {
    manufacturer?: string; 
    model?: string; 
    osName?: string; 
    osVersion: string;
    browser?: string; 
    browserVersion?: string;
    appVersion?: string; 
  };
  location?: {
    country: string;
    city: string;
    timezone: string;
  };
}

export interface ILocationInfo {
  address: string;
  city: string;
  state: string;
}

export interface IResult<T = any> {
  error: boolean;
  message: string;
  code: number;
  data: any;
}

export interface IData {
  key: string;
  value: any;
}
export interface IBulkUser {
  _id: ObjectId | null | string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  phoneCode: string;
  userType: string;
}

export interface ICustomResponse<T> extends Response {
  customResults?: {
    success: boolean;
    count: number;
    total: number;
    pagination: {
      next?: { page: number; limit: number };
      prev?: { page: number; limit: number };
    };
    data: T[];
  };
  status: any;
}

export interface IOptions {
  host: string;
  port: number | string;
  password: string;
  user: string;
}


export interface ITransactionDoc extends Document {
  type: TransactionsType;
  medium: string;
  resource: string;
  entity: string;
  reference: string;
  currency: string;
  providerRef: string;
  providerName: string;
  description: string;
  narration: string;
  amount: number;
  unitAmount: number; // kobo unit * 100
  fee: number;
  unitFee: number; // kobo unit * 100
  status: string;
  reason: string;
  message: string;
  providerData: Array<Record<string, any>>;
  metadata: Array<Record<string, any>>;
  channel: string;
  slug: string;
  card: IDebitCard;

  // relationships
  user: ObjectId | any;

  // timestamps
  createdAt: string;
  updatedAt: string;
  _versions: number;
  _id: ObjectId;
  id: ObjectId;

  // functions
  getAll(): Array<ITransactionDoc>;
}

export interface IDebitCard {
  authCode: string; // encrypt this data
  cardBin: string;
  cardLast: string;
  expiryMonth: string;
  expiryYear: string;
  cardPan: string; // encrypt this data
  token: string;
  provider: string;
}

export interface IEmailRequest {
  recipient: string;
  subject: string;
  content: any;
  type: EmailType;
  template?: string;
  attachments?: any[];
}
