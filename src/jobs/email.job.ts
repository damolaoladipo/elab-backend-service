// src/jobs/sendEmail.job.ts

import { Job } from "agenda";
import emailService from "../services/email.service";
import { IEmailJob } from "../utils/interface.util";

export const sendEmailJob = async (job: Job) => {
  const data = job.attrs.data as IEmailJob;

  if (!data || !data.user || !data.user.email || !data.subject || !data.template) {
    console.warn("Invalid email job data:", data);
    return;
  }

  await emailService.dispatch({
    driver: data.driver,
    user: data.user,
    template: data.template,
    code: data.code,
    metadata: data.metadata,
    options: {
      subject: data.subject,
      ...data.payload,
    },
  });
};
