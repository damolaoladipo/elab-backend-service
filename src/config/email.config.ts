import { EmailDriver, ENVType } from "../utils/enums.util";
import { EmailConfig } from "../utils/interface.util";
import 'dotenv/config';


const env = process.env.NODE_ENV as ENVType;
const driver = process.env.EMAIL_DRIVER?.toLowerCase() as string;

export const getEmailConfig = (): EmailConfig => {
  switch (driver) {
    case EmailDriver.MAILERSEND:
      return {
        service: EmailDriver.MAILERSEND,
        fromEmail: process.env.FROM_EMAIL!,
        fromName: process.env.FROM_NAME!,
        apiKey: process.env.MAILERSEND_API_KEY!,
        clientUrl: process.env.CLIENT_URL,
        isTestMode: env === ENVType.DEVELOPMENT, // or use MAILERSEND_TEST_MODE
        sendingDomain: process.env.MAILERSEND_DOMAIN,
      };

    case EmailDriver.MAILTRAP:
      return {
        service: EmailDriver.MAILTRAP,
        fromEmail: process.env.EMAIL_FROM_EMAIL as string,
        fromName: process.env.EMAIL_FROM_NAME as string,
        apiKey: process.env.MAILTRAP_API_KEY! as string,
        smtpHost: process.env.MAILTRAP_SMTP_HOST!,
        smtpPort: Number(process.env.MAILTRAP_SMTP_PORT || 587),
        smtpUser: process.env.MAILTRAP_SMTP_USER!,
        smtpPass: process.env.MAILTRAP_SMTP_PASS!,
        clientUrl: process.env.CLIENT_URL,
        isTestMode: true, // Mailtrap is only for dev/test
      };

    default:
      throw new Error(`Unsupported email service provider: ${driver}`);
  }
};

export const EMAIL_CONFIG = getEmailConfig();