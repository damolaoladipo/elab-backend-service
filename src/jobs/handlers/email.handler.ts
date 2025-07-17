import emailService from "../../services/email.service";

const emailHandlers = {
  paymentConfirmationEMail: async (job: any) => {
    const { data } = job.attrs;
    const { user, payload } = data;

    await emailService.dispatch(
      user,
       "Your payment is confirmed",
      "payment-confirmation",
     
      { ...payload }
    );
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
