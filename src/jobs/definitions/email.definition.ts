import emailHandlers from "../handlers/email.handler"

const emailDefinitions = (agenda: any) => {
    agenda.define("payment confirmation email", emailHandlers.paymentConfirmationEMail)

    agenda.define("forgot password email", emailHandlers.forgotPasswordEmail)

    agenda.define("reset password email", emailHandlers.resetPasswordEmail)

    agenda.define("newsletter welcome", emailHandlers.NewsletterWelcomeEmail)

    agenda.define("send us a message", emailHandlers.sendUsAMessage);
}

export default emailDefinitions