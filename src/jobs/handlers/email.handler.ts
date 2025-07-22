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
       "Reset your password",
      "forgot-password",
     
      { ...payload }
    );
  },

    resetPasswordEmail: async (job: any) => {
    const { data } = job.attrs;
    const { user, payload } = data;

    await emailService.dispatch(
      user,
       "Your password was reset successfully",
      "reset-password",
     
      { ...payload }
    );
  },


    NewsletterWelcomeEmail: async (job: any) => {
    const { data } = job.attrs;
    const { user, payload } = data;

    await emailService.dispatch(
      user,
       "Thank you for suscribing",
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
