export const config = {
  secretKey: process.env.PAYSTACK_SECRET_KEY!,
  publicKey: process.env.PAYSTACK_PUBLIC_KEY!,
  baseUrl: process.env.PAYSTACK_BASE_URL!,
  testSecretkey: process.env.PAYSTACK_TEST_SECRET_KEY!,
};

export const paystackWebhookSecret = process.env.PAYSTACK_WEBHOOK_SECRET!;

export const dbConfig = {
  dbPassword: process.env.DATABASE_PASSWORD,
};
