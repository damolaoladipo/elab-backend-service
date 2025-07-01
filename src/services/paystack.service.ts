import axios from "axios";
import { paystackConfig } from "../config/paystack.config";

class PaystackService {
  private readonly headers = {
    Authorization: `Bearer ${paystackConfig.secretKey}`,
    "Content-Type": "application/json",
  };

  async initializePayment(data: {
    amount: number; // in kobo
    email: string;
    metadata?: Record<string, any>;
    callback_url?: string;
  }) {
    const res = await axios.post(
      `${paystackConfig.baseUrl}/transaction/initialize`,
      data,
      { headers: this.headers }
    );

    return res.data;
  }

  async verifyTransaction(reference: string) {
    const res = await axios.get(
      `${paystackConfig.baseUrl}/transaction/verify/${reference}`,
      { headers: this.headers }
    );

    return res.data;
  }
}

export default new PaystackService();
