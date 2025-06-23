import { Document, ObjectId } from "mongoose";
import { EmailType, OtpType, PasswordType, TransactionsType, UserType } from "./enums.util";

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
  passwordType: PasswordType;
  userType: UserType;
  avatar: string;

  Otp: string;
  OtpExpiry: number;
  otpType: OtpType;
  accessToken: string;
  accessTokenExpiry: Date;

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


export interface IEvent extends Document {
  name: string;
  eventType: string; 
  lcoation: string;
  image: string;
  description: string;
  features: Array<string>;
  startDate: Date;
  endDate: Date;
  //relationships
  user: IUserDoc | ObjectId;
  
  // time stamps
  createdAt: Date;
  updatedAt: Date;
  _version: number;
  _id: ObjectId;
  id: ObjectId;
}


export interface IProject extends Document {
  name: string;
  image: string;
  description: string;
  startDate: Date;
  
  //relationships
  user: IUserDoc | ObjectId;
  
  // time stamps
  createdAt: Date;
  updatedAt: Date;
  _version: number;
  _id: ObjectId;
  id: ObjectId;
}



export interface IArchive extends Document {
  title: string;
  image: string;
  excerpt?: string;
  description?: string;
  link?: string
  content: string;
  author: string;
  category: string;
  tags: Array<string>;
  type: string; // news, press release or insight 

  //relationships
  user: IUserDoc | ObjectId;
  
  // time stamps
  createdAt: Date;
  updatedAt: Date;
  _version: number;
  _id: ObjectId;
  id: ObjectId;
}

export interface IResource extends Document {
  title: string;
  image: string;
  description: string;
  resource: string;
  type: string; 
  author: string;
  category: string;
  tags: Array<string>;

    //relationships
  user: IUserDoc | ObjectId;
  
  // time stamps
  createdAt: Date;
  updatedAt: Date;
  _version: number;
  _id: ObjectId;
  id: ObjectId;
}


export interface ICompany extends Document {
  name: string;
  description: string;
  logo: string;
  status: string;
  url: string;
  email: string;
  brochure: string;
  
  //relationships
  user: IUserDoc | ObjectId;
  
  // time stamps
  createdAt: Date;
  updatedAt: Date;
  _version: number;
  _id: ObjectId;
  id: ObjectId;
}