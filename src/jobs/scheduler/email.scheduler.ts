import Job from "../../services/jobs.service";

const emailJobSchedular = {
  sendPaymentConfirmationEMail: async (data: any) => {
    Job.now("payment confirmation email", data);
  },

   sendForgotPasswordEmail: async (data: any) => {
    Job.now("forgot password email", data);
  },

  sendResetPasswordEmail: async (data: any) => {
    Job.now("reset password email", data);
  },

  sendUsAMessage: async (data: any) => {
    Job.now("send us a message", data);
  },
};

export default emailJobSchedular;
