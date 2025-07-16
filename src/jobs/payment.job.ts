import { Job } from "agenda";
import transactionService from "../services/transaction.service";
import { IPaymentJob } from "../utils/interface.util";

export const handlePaymentJob = async (job: Job) => {
  const { reference, type } = job.attrs.data as IPaymentJob;

  if (type === "verify") {
    await transactionService.verifyPurchase(reference);
  }
};