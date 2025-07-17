import emailHandlers from "../handlers/email.handler"

const emailDefinitions = (agenda: any) => {
    agenda.define("payment confirmation email", emailHandlers.paymentConfirmationEMail)

    agenda.define("send us a message", emailHandlers.sendUsAMessage);
}

export default emailDefinitions