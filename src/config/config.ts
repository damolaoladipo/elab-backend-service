import { EmailDriver, ENVType } from "../utils/enums.util";
import { EmailConfig } from "../utils/interface.util";

export const config = {
  secretKey: process.env.PAYSTACK_SECRET_KEY!,
  publicKey: process.env.PAYSTACK_PUBLIC_KEY!,
  baseUrl: process.env.PAYSTACK_BASE_URL!,
  testSecretkey: process.env.PAYSTACK_TEST_SECRET_KEY!
};

export const paystackWebhookSecret = process.env.PAYSTACK_WEBHOOK_SECRET!;

export const dbConfig = {
  dbPassword: process.env.DATABASE_PASSWORD
}


export function getEmailConfig(): EmailConfig {
  const env = process.env.NODE_ENV;

  if (env === ENVType.PRODUCTION) {
    return {
      service: EmailDriver.MAILSEND,
      fromEmail: process.env.MAIL_FROM_EMAIL!,
      fromName: process.env.MAIL_FROM_NAME!,
      replyTo: process.env.MAIL_REPLY_TO,
      apiKey: process.env.MAILSEND_API_KEY!,
      templateId: process.env.MAILSEND_TEMPLATE_ID,
      sendingDomain: process.env.EMAIL_DOMAIN,
      clientUrl: process.env.CLIENT_APP_URL as string,
      isTestMode: false,
    };
  }

  if (env === ENVType.STAGING) {
    return {
      service: EmailDriver.MAILSEND,
      fromEmail: process.env.MAIL_FROM_EMAIL!,
      fromName: process.env.MAIL_FROM_NAME!,
      replyTo: process.env.MAIL_REPLY_TO,
      apiKey: process.env.MAILERSEND_STAGING_API_KEY!,
      templateId: process.env.MAILSEND_TEMPLATE_ID,
      sendingDomain: process.env.MAILERSEND_STAGING_DOMAIN,
      clientUrl: process.env.CLIENT_STAGING_URL as string,
      isTestMode: false,
    };
  }

  if (env === ENVType.DEVELOPMENT) {
    return {
      service: EmailDriver.MAILSEND,
      fromEmail: process.env.EMAIL_FROM_EMAIL!,
      fromName: process.env.EMAIL_FROM_NAME as string,
      replyTo: process.env.EMAIL_REPLY_TO as string,
      apiKey: process.env.MAILERSEND_STAGING_API_KEY as string,
      templateId: process.env.MAILSEND_TEMPLATE_ID,
      sendingDomain: process.env.MAILERSEND_STAGING_DOMAIN,
      clientUrl: process.env.CLIENT_LOCAL_URL as string,
      isTestMode: false,
    };
  }
  
  throw new Error("Invalid NODE_ENV. Email config not set.");
}

export const EMAIL_CONFIG = getEmailConfig();
