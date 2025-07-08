// // ------------------ tests/transaction.test.ts ------------------
// import transactionService from "../src/services/transaction.service";
// import Store from "../src/models/Store.model";
// import Transaction from "../src/models/Transaction.model";
// import paystackService from "../src/services/paystack.service";

// jest.mock("../src/models/Store.model");
// jest.mock("../src/models/Transaction.model");
// jest.mock("../src/services/paystack.service");

// describe("TransactionService", () => {
//   const mockStore = {
//     _id: "store123",
//     price: 1000,
//     discountedPrice: 800,
//     status: "published",
//     category: "ebook",
//   };

//   const mockUser = {
//     _id: "user123",
//     email: "test@example.com",
//   };

//   const mockPaystackResponse = {
//     data: {
//       authorization_url: "https://paystack.test/redirect",
//       reference: "ref123",
//     },
//   };

//   beforeEach(() => {
//     (Store.findById as any).mockResolvedValue(mockStore);
//     (paystackService.initializePayment as any).mockResolvedValue(mockPaystackResponse);
//     (Transaction.create as any) = jest.fn().mockResolvedValue({
//       reference: "ref123",
//       user: "user123",
//       amount: 800,
//       status: "pending",
//     });
//   });

//   afterEach(() => jest.clearAllMocks());

//   it("should initiate a purchase and create a pending transaction", async () => {
//     const result = await transactionService.initiatePurchase("store123", mockUser as any);

//     expect(result).toHaveProperty("paymentUrl", "https://paystack.test/redirect");
//     expect(result).toHaveProperty("reference", "ref123");

//     expect(Transaction.create).toHaveBeenCalledWith(
//       expect.objectContaining({
//         reference: "ref123",
//         user: "user123",
//         amount: 800,
//         status: "pending",
//       })
//     );
//   });
// });
