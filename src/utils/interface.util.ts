import { Document, ObjectId } from "mongoose";
import {
  EmailDriver,
  EmailType,
  OtpType,
  PasswordType,
  TransactionsType,
  UserType,
  WysiwygBlockType,
} from "./enums.util";

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
  slug: string;
  email: string;
  password: string;
  passwordType: PasswordType;
  userType: UserType;
  avatar: string;

  Otp: string;
  OtpExpiry: number;
  otpType: OtpType;
  accessToken: string;
  accessTokenExpiry: Date;
  tokenVersion: number;

  isSuper: boolean;
  isAdmin: boolean;

  isActive: boolean;
  isActivated: boolean;
  isDeactivated: boolean;

  lastLogin: string;
  loginLimit: number;
  isLocked: boolean;
  lockedUntil: Nullable<Date>;

  // relationships
  role: ObjectId | any;

  // time stamps
  createdAt: Date;
  updatedAt: Date;
  _version: number;
  _id: ObjectId;
  id: ObjectId;
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

// eLab Interfaces

export interface IEventDoc extends Document {
  title: string;
  slug: string;
  image: string;
  content: IWysiwygContent[];
  features?: IWysiwygContent[];
  joinUrl?: string;
  planUrl?: string;
  sponsorUrl?: string;
  communityUrl?: string;

  //relationships
  user: IUserDoc | ObjectId;

  // time stamps
  createdAt: Date;
  updatedAt: Date;
  _version: number;
  _id: ObjectId;
  id: ObjectId;
}

export interface IProjectDoc extends Document {
  title: string;
  slug: string;
  image: string; //upload file
  content: IWysiwygContent;
  websiteUrl?: string;
  volunteerUrl?: string;
  partnerUrl?: string;
  sponsorUrl?: string;

  //relationships
  user: IUserDoc | ObjectId;

  // time stamps
  createdAt: Date;
  updatedAt: Date;
  _version: number;
  _id: ObjectId;
  id: ObjectId;
}

export interface IArchiveDoc extends Document {
  title: string;
  slug: string;
  category: string; // news, press release, insight or resource
  image?: string; //upload file
  content?: IWysiwygContent;
  link?: string;
  author?: string;
  resourceLink?: string; // upload file for resoruces

  tags: Array<string>;
  status: string; // published, draft, archived

  //relationships
  user: IUserDoc | ObjectId;

  // time stamps
  createdAt: Date;
  updatedAt: Date;
  _version: number;
  _id: ObjectId;
  id: ObjectId;
}

export interface IWysiwygContent {
  type: WysiwygBlockType;
  content?: string; // for text-based blocks
  level?: number; // for heading levels (e.g. h1 = 1, h2 = 2)
  language?: string; // for code blocks (e.g. "javascript", "markdown")
  src?: string; // for images
  alt?: string;
  href?: string; // for links
  items?: string[]; // for list blocks
}

export interface IVentureDoc extends Document {
  name: string;
  slug: string;
  description: IWysiwygContent;
  logo: string;
  status: string;
  websiteUrl: string;
  brochureUrl: string;
  contact: string;

  //relationships
  user: IUserDoc | ObjectId;

  // time stamps
  createdAt: Date;
  updatedAt: Date;
  _version: number;
  _id: ObjectId;
  id: ObjectId;
}

export interface IStoreDoc extends Document {
  name: string;
  slug: string;
  price: number;
  discount?: number; // percentage discount
  discountedPrice?: number;
  image: string; //upload file
  category: string; // e.g. "merch", "ebook", "courses"

  author?: string; // for ebooks or courses
  excerpt?: string; // short description or summary
  description: string;
  url: string;
  status: string;
  color?: Array<string>;
  pageCount?: number;
  size?: Array<string>;

  //relationships
  user: IUserDoc | ObjectId;

  // time stamps
  createdAt: Date;
  updatedAt: Date;
  _version: number;
  _id: ObjectId;
  id: ObjectId;
}

export interface IEmployeeDoc extends Document {
  name: string;
  slug: string;
  role: string;
  image: string; //upload file
  status: string; // e.g. "active", "inactive", "on leave"
  socialLink?: string;

  // relationships
  user: ObjectId | any;
  // time stamps
  createdAt: Date;
  updatedAt: Date;
  _version: number;
  _id: ObjectId;
  id: ObjectId;
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

export interface ISlugOptions {
  input: string;
  slugExistsFn: (slug: string) => Promise<boolean>;
}

export interface IJobDoc extends Document {
  name: string;
  email: string;
  data: Record<string, any>;
}


export interface IEmailJob {
  user: IUserDoc;
  subject: string;
  payload: Record<string, any>;
  driver: EmailDriver;
  template?: string;
  code?: string;
  metadata?: any;
  options?: {
    subject?: string;
    salute?: string;
    buttonUrl?: string;
    buttonText?: string;
    emailBody?: string;
    emailBodies?: Array<string>;
    bodyOne?: string;
    bodyTwo?: string;
    bodyThree?: string;
    otpType?: OtpType;
    status?: string;
  };
}


export interface IPaymentJob {
  reference: string;
  type: "verify" | "refund";
}

export interface IJobPayload {
  email?: IEmailJob;
  payment?: IPaymentJob;
}

export interface EmailConfig {
  fromEmail: string;
  fromName: string;
  replyTo?: string;
  service: EmailDriver;
  apiKey?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  templateId?: string;
  isTestMode?: boolean;
  sendingDomain?: string;
  clientUrl?: string;
}

export interface EmailOptions {
  subject?: string;
  salute?: string;
  buttonUrl?: string;
  buttonText?: string;
  emailBody?: string;
  emailBodies?: string[];
  bodyOne?: string;
  bodyTwo?: string;
  bodyThree?: string;
  preheaderText?: string;
  status?: string;
}


export interface IJobDoc extends Document {
  name: string
  email: string
  data: Record<string, any>
}