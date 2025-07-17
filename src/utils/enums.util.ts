export enum ENVType {
  PRODUCTION = "production",
  STAGING = "staging",
  DEVELOPMENT = "development",
}

export enum AppChannel {
  WEB = "web",
  MOBILE = "mobile",
  DESKTOP = "desktop",
  TABLET = "tablet",
  SMART_TV = "smart-tv",
  WATCH = "watch",
}

export enum UserType {
  USER = "user",
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
}

export enum DbModelsType {
  ARCHIVE = "archive",
  COMPANY = "company",
  EMPLOYEE = "employee",
  EVENT = "event",
  JOB = "job",
  PERMISSION = "permission",
  PROJECT = "project",
  RESOURCE = "resource",
  ROLE = "role",
  SUBSCRIPTION = "subscription",
  STORE = "store",
  TRANSACTION = "transaction",
  USER = "user",
}


export enum WysiwygBlockType {
  Paragraph = "paragraph",
  Heading = "heading",
  Blockquote = "blockquote",
  Code = "code",
  Image = "image",
  List = "list",
  Link = "link",
}


export enum PasswordType {
  USERGENERATED = "user-generated",
  SYSTEMGENERATED = "system-generated",
  TEMPORARY = "temporary",
  RESET = "reset",
}

export enum OtpType {
  REGISTER = "register",
  LOGIN = "login",
  GENERIC = "generic",
  ACTIVATEACCOUNT = "activate-account",
  CHANGEPASSWORD = "change-password",
  FORGOTPASSWORD = "forgot-password",
}

export enum VerifyOTP {
  REGISTER = "register",
  PASSWORD_RESET = "password-reset",
  CHANGE_PASSWORD = "change-password",
  LOGIN = "login",
  VERIFY = "verify",
}


export enum EmailDriver {
  MAILTRAP = "mailtrap",
  MAILERSEND = "mailersend",
}

export enum EmailTemplate {
  WELCOME = "welcome",
  PAYMENT_SUCCESSFUL = "payment-successful",
  PASSWORD_RESET = "password-reset",
  PASSWORD_CHANGED = "password-changed",
  EMAIL_VERIFICATION = "email-verification",
  GENERIC = "generic"
}


export enum EmailPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export enum EmailStatus {
  DELIVERED = 'delivered',
  FAILED = 'failed',
  BOUNCED = 'bounced',
  OPENED = 'opened',
  CLICKED = 'clicked'
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled'
}

export enum EmailService {

}


export enum EmailType {
  TRANSACTIONAL = 'transactional',
  MARKETING = 'marketing',
  PRODUCT_UPDATE = 'product_update',
  FEATURE_ANNOUNCEMENT = 'feature_announcement'
}

export enum TransactionsType {
  SUBSCRIPTION = "subscription",
  REFUND = "refund",
  ONETIME = "onetime",
  UPGRADE = "upgrade",
  PAYMENT_METHOD_UPDATE = "payment-method-update",
  PURCHASE = "purchase"
}
