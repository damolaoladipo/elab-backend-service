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

  forgotPasswordEmail: async (job: any) => {
    const { data } = job.attrs;
    const { user, payload } = data;

    await emailService.dispatch(
      user,
       "Your payment is confirmed",
      "forgot-password",
     
      { ...payload }
    );
  },

    resetPasswordEmail: async (job: any) => {
    const { data } = job.attrs;
    const { user, payload } = data;

    await emailService.dispatch(
      user,
       "Your payment is confirmed",
      "reset-password",
     
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
