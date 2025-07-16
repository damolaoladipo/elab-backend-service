import { Agenda } from "agenda";
import { sendEmailJob } from "./email.job";
import { handlePaymentJob } from "./payment.job";

export default function defineAllJobs(agenda: Agenda) {
  agenda.define("send-email", sendEmailJob);
  agenda.define("handle-payment", handlePaymentJob);
}
