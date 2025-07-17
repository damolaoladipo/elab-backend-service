import emailService from "../../services/email.service";
import { log } from "console";

const emailHandlers = {
  
    paymentConfirmationEMail: async (job: any) => {
    const { data } = job.attrs;
    
    log("sending confirmation email")
    const { user, payload, options, driver, template, subject } = data;

    await emailService.sendEmail({
      user,
      options,
      driver,
      template,
    });
  },
};

export default emailHandlers;
