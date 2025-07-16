import { Job } from "agenda";
import emailService from "../services/email.service";
import { IEmailJob } from "../utils/interface.util";

export const sendEmailJob = async (job: Job) => {
  const { to, subject, template, payload } = job.attrs.data as IEmailJob;

  await emailService.sendEmail({
    driver: "default",
    user: { email: to } as any,
    template,
    options: {
      subject,
      ...payload,
    },
  });
};
