import emailService from "../../services/email.service";
import { log } from "console";

const emailHandlers = {
  paymentConfirmationEMail: async (job: any) => {
    const { data } = job.attrs;

    log("sending confirmation email");
    const { user, payload, options, driver, template, subject } = data;

    await emailService.dispatch(user, "payment-confirmation", "Payment Complete", {
      name: user.name,
      amount: "$100",
    });
  },
  
   sendUsAMessage: async (job: any) => {
    const { data } = job.attrs;
    const { user } = data || {};

    if (!user) {
      console.error("Missing user data for sendUsAMessage");
      return;
    }

    await emailService.sendUsAMessage(user);
  },
};

export default emailHandlers;
