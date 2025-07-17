import pug from "pug";
import appRootPath from "app-root-path";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { MailtrapClient } from "mailtrap";
import { IUserDoc, IResult, EmailConfig } from "../utils/interface.util";
import { EmailDriver } from "../utils/enums.util";
import { EMAIL_CONFIG } from "../config/email.config";

const BASE_FOLDER = `${appRootPath.path}/src/views/emails`;

class EmailService {
  private config: EmailConfig;
  private mailersend?: MailerSend;
  private mailtrap?: MailtrapClient;

  constructor() {
    this.config = EMAIL_CONFIG;

    switch (this.config.service) {
      case EmailDriver.MAILSEND:
        this.mailersend = new MailerSend({ apiKey: this.config.apiKey! });
        break;

      case EmailDriver.MAILTRAP:
        this.mailtrap = new MailtrapClient({ token: this.config.apiKey! });
        break;
    }
  }

  private renderTemplate(
    template: string,
    locals: Record<string, any>
  ): string {
    const templatePath = `${BASE_FOLDER}/${template}.pug`;
    return pug.renderFile(templatePath, locals);
  }

  public async dispatch(
    user: IUserDoc,
    subject: string,
    template: string,
    locals: Record<string, any> = {}
  ): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };

    try {
      const html = this.renderTemplate(template, { ...locals, user, subject });

      const sendFnMap: Partial<Record<EmailDriver, () => Promise<void>>> = {
        [EmailDriver.MAILSEND]: async () => {
          const params = new EmailParams()
            .setFrom(new Sender(this.config.fromEmail!, this.config.fromName!))
            .setTo([new Recipient(user.email)])
            .setReplyTo(new Sender(this.config.replyTo!))
            .setSubject(subject)
            .setHtml(html);

          await this.mailersend!.email.send(params);
        },

        [EmailDriver.MAILTRAP]: async () => {
          const payload = {
            from: {
              email: this.config.fromEmail!,
              name: this.config.fromName!,
            },
            to: [{ email: user.email }],
            subject,
            html,
          };

          await this.mailtrap!.send(payload);
        },
      };

      const sendFn = sendFnMap[this.config.service];
      if (!sendFn)
        throw new Error(`Email driver "${this.config.service}" not supported`);

      await sendFn();

      result.message = `Email sent to ${user.email}`;
      result.data = { template };
    } catch (err) {
      console.error("Email send error:", err);
      result.error = true;
      result.message = "Failed to send email";
      result.code = 500;
      result.data = { error: err instanceof Error ? err.message : String(err) };
    }

    return result;
  }

  // Examples
  public async paymentConfirmationEmail(
    user: IUserDoc, itemName: string, price: number
  ) {
    return this.dispatch(
      user, "Payment Successful", "store-item-confirmation", { itemName, price }
    );
  }

  public  async sendVerification(user: IUserDoc) {
    await this.dispatch(user, "verification", "Welcome to The Assembly.");
  }

  public async welcomeEmail(user: IUserDoc) {
    return this.dispatch(user, "Welcome to Troott", "welcome");
  }

  public async otpEmail(user: IUserDoc, code: string) {
    return this.dispatch(user, "Your OTP Code", "otp", { code });
  }

  public async sendUsAMessage(user: IUserDoc) {
    await this.dispatch(user, "sendUsAMessage", "Message to Us", {});
  }
}

const emailService = new EmailService();
export default emailService;
