import { renderFile } from "ejs";
import appRootPath from "app-root-path";
import sgMail from "@sendgrid/mail";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { SendEmailDTO } from "../dtos/email.dto";
import { EmailDriver, EmailTemplate } from "../utils/enums.util";
import { EmailConfig, IEmailJob, IResult, EmailOptions } from "../utils/interface.util";
import { EMAIL_CONFIG } from "../config/config";


const BASE_FOLDER = `${appRootPath.path}/src`;
class EmailService {
  private config: EmailConfig;
  private mailersend?: MailerSend;

  constructor() {
    this.config = EMAIL_CONFIG;

    switch (this.config.service) {
      case EmailDriver.MAILSEND:
        this.mailersend = new MailerSend({ apiKey: this.config.apiKey! });
        break;

      case EmailDriver.MAILTRAP:
        sgMail.setApiKey(this.config.apiKey!);
        break;
    }
  }

  /**
   * Dispatch email using the configured service
   * @param data Email data to be sent
   * @param driver Email service driver
   */
  private async dispatch(data: IEmailJob): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };

    try {
      const templatePath = `${BASE_FOLDER}/views/emails/${data.template}.ejs`;

      const html = await new Promise<string>((resolve, reject) => {
        renderFile(
          templatePath,
          {
            ...data.payload,
            user: data.user,
            code: data.code,
            subject: data.subject,
          },
          {},
          (err, str) => {
            if (err || !str)
              return reject(err || new Error("Failed to render template"));
            resolve(str);
          }
        );
      });

      const sendFnMap: Partial<Record<EmailDriver, () => Promise<void>>> = {

        [EmailDriver.MAILSEND]: async () => {
          const params = new EmailParams()
            .setFrom(new Sender(this.config.fromEmail!, this.config.fromName!))
            .setTo([new Recipient(data.user.email)])
            .setReplyTo(new Sender(this.config.replyTo as string))
            .setSubject(data.subject)
            .setHtml(html);

          await this.mailersend!.email.send(params);
        },

      };

      const sendFn = sendFnMap[this.config.service];
      if (!sendFn)
        throw new Error(`Email driver "${this.config.service}" not supported`);
      await sendFn();

      result.message = `Email sent to ${data.user.email}`;
      result.data = { template: data.template };
    } catch (error) {
      console.error("Dispatch email error:", error);
      result.error = true;
      result.message = "Failed to send email";
      result.code = 500;
      result.data = {
        error: error instanceof Error ? error.message : String(error),
      };
    }

    return result;
  }

  /**
   * Send email using the specified driver and user data
   * @param config Configuration for sending email
   * @returns Result of the email sending operation
   */
  public async sendEmail(config: SendEmailDTO): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };

    try {
      const { driver, user, options, code, metadata, template } = config;
      const _template = template || EmailTemplate.GENERIC;
      const fromName = this.config.fromName || process.env.EMAIL_FROM_NAME!;
      const subject = options?.subject || "Troott Notification";
      const salute = options?.salute || "Hi there";
      const url = options?.buttonUrl || "";
      const buttonText = options?.buttonText || "Take Action";

      const emailContent: IEmailJob = {
        user,
        subject: subject,
        driver: driver,
        template: _template,
        code: code,
        metadata,
        payload: {
          email: user.email,
          fromName: fromName,
          emailTitle: subject,
          emailSalute: salute,
          preheaderText: subject.toLowerCase(),
          bodyOne: options?.bodyOne,
          bodyTwo: options?.bodyTwo,
          bodyThree: options?.bodyThree,
          buttonText,
          buttonUrl: url,
        },
        options: options as EmailOptions,
      };

      await this.dispatch(emailContent);
      result.message = `Email sent successfully to ${user.email}`;
      result.data = emailContent;
    } catch (error) {
      console.error("Error sending email:", error);
      result.error = true;
      result.message = "Failed to send email.";
      result.code = 500;
      result.data = {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }

    return result;
  }

}

const emailService = new EmailService();
export default emailService;
