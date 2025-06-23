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
  USER = "user",
  ROLE = "role",
  PERMISSION = "permission",
  API_KEY = "ApiKey",
  PLAN = "plan",
  SUBSCRIPTION = "subscription",
  TRANSACTION = "transaction",
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
  SENDGRID = "sendgrid",
  AWS = "aws",
  MAILTRAP = "mailtrap",
}

export enum EmailTemplate {
  WELCOME = "welcome",
  USER_INVITE = "user-invite",
  PASSWORD_RESET = "password-reset",
  PASSWORD_CHANGED = "password-changed",
  EMAIL_VERIFICATION = "email-verification",
  INVITE = "invite",
  OTP = "otp",
  VERIFY_EMAIL = "verify-email",
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
  PAYMENT_METHOD_UPDATE = "payment-method-update"
}
