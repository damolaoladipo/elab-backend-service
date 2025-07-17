import { EmailDriver, ENVType } from "../utils/enums.util";
import { EmailConfig } from "../utils/interface.util";

export function getEmailConfig(): EmailConfig {
  const env = process.env.NODE_ENV as ENVType;
  const service = process.env.EMAIL_SERVICE as EmailDriver;

  const baseConfig = {
    service,
    fromEmail: process.env.MAIL_FROM_EMAIL!,
    fromName: process.env.MAIL_FROM_NAME!,
    replyTo: process.env.MAIL_REPLY_TO,
    sendingDomain: process.env.EMAIL_DOMAIN,
    clientUrl:
      env === ENVType.DEVELOPMENT
        ? process.env.CLIENT_LOCAL_URL!
        : process.env.CLIENT_APP_URL!,
    isTestMode: env === ENVType.DEVELOPMENT,
  };

  if (service === EmailDriver.MAILTRAP) {
    return {
      ...baseConfig,
      apiKey: process.env.MAILTRAP_API_KEY!,
    };
  }

  if (service === EmailDriver.MAILSEND) {
    return {
      ...baseConfig,
      apiKey: process.env.MAILSEND_API_KEY!,
    };
  }

  throw new Error("Unsupported email service provider");
}

export const EMAIL_CONFIG = getEmailConfig();