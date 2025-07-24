import pug from "pug";
import appRootPath from "app-root-path";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { MailtrapClient } from "mailtrap";
import { IUserDoc, IResult, EmailConfig } from "../utils/interface.util";
import { EmailDriver } from "../utils/enums.util";
import { EMAIL_CONFIG } from "../config/email.config";
import { convert } from "html-to-text";

const BASE_FOLDER = `${appRootPath.path}/src/views/emails`;

class EmailService {
  private config: EmailConfig;
  private mailersend?: MailerSend;
  private mailtrap?: MailtrapClient;

  constructor() {
    this.config = EMAIL_CONFIG;

    switch (this.config.service) {
      case EmailDriver.MAILERSEND:
        this.mailersend = new MailerSend({ apiKey: this.config.apiKey! });
        break;

      case EmailDriver.MAILTRAP:
        this.mailtrap = new MailtrapClient({ token: this.config.apiKey! });
        if (!process.env.EMAIL_FROM_EMAIL || !process.env.EMAIL_FROM_NAME) {
          throw new Error("FROM_EMAIL and FROM_NAME must be set in .env");
        }
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
      const text = convert(html);

      const sendFnMap: Partial<Record<EmailDriver, () => Promise<void>>> = {
        [EmailDriver.MAILERSEND]: async () => {
          const params = new EmailParams()
            .setFrom(new Sender(this.config.fromEmail!, this.config.fromName!))
            .setTo([new Recipient(user.email)])
            .setReplyTo(new Sender(this.config.replyTo!))
            .setSubject(subject)
            .setHtml(text);

          await this.mailersend!.email.send(params);
        },

        [EmailDriver.MAILTRAP]: async () => {
          const payload = {
            from: {
              email: this.config.fromEmail as string,
              name: this.config.fromName as string,
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
    user: IUserDoc,
    itemName: string,
    price: number
  ) {
    return this.dispatch(
      user,
      "Payment Successful",
      "store-item-confirmation",
      { itemName, price }
    );
  }

  public async forgotPasswordEmail(user: IUserDoc, resetLink: string) {
    return this.dispatch(user, "Reset your password", "forgot-password", {
      resetLink,
    });
  }

  public async passwordResetSuccessEmail(user: IUserDoc) {
    return this.dispatch(
      user,
      "Your password was reset successfully",
      "reset-password"
    );
  }

  public async sendVerification(user: IUserDoc) {
    await this.dispatch(user, "verification", "Welcome to The Assembly.");
  }

  public async welcomeEmail(user: IUserDoc) {
    return this.dispatch(user, "Welcome to Troott", "welcome");
  }

  public async NewsletterWelcomeEmail(user: any) {
    return this.dispatch(
      user,
      "Welcome to our newsletter!",
      "newsletter welcome"
    );
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
