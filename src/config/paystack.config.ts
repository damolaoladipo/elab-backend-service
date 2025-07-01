export const paystackConfig = {
  secretKey: process.env.PAYSTACK_SECRET_KEY!,
  publicKey: process.env.PAYSTACK_PUBLIC_KEY!,
  baseUrl: process.env.PAYSTACK_BASE_URL!,
};

export const paystackWebhookSecret = process.env.PAYSTACK_WEBHOOK_SECRET!;
