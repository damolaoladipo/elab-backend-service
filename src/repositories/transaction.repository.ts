import { FilterQuery, Model, ObjectId } from "mongoose";
import Transaction from "../models/Transaction.model";
import { ITransactionDoc, IResult } from "../utils/interface.util";
import mongoose from "mongoose";

class TransactionRepository {
  private model: Model<ITransactionDoc>;

  constructor() {
    this.model = Transaction;
  }

  /**
   * @name findTransaction
   * @param {string} input - The ObjectId or slug of the transaction.
   * @returns {Promise<IResult>} Result object containing the transaction data or error information.
   */
  public async findTransaction(input: string): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };

    const isValidObjectId =
      mongoose.Types.ObjectId.isValid(input) &&
      new mongoose.Types.ObjectId(input).toString() === input;

    const transaction = isValidObjectId
      ? await this.model.findById(input)
      : await this.model.findOne({ id: input });

    if (!transaction) {
      result.error = true;
      result.code = 404;
      result.message = "Transaction not found";
      return result;
    }

    result.data = transaction.toJSON();
    result.message = "Transaction fetched successfully";
    return result;
  }

  /**
   * @name getTransactions
   * @returns {Promise<IResult>}
   * @description Get all transactions
   */
  public async getTransactions(): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };
    const transactions = await this.model.find({}).lean();

    if (!transactions || transactions.length === 0) {
      result.error = true;
      result.code = 404;
      result.message = "No transactions found";
      return result;
    }

    result.message = "Transactions fetched successfully";
    result.data = transactions;
    return result;
  }


  /**
   * @name deleteTransaction
   * @param id
   * @returns {Promise<IResult>}
   * @description Delete a transaction by ID
   */
  public async deleteTransaction(id: string): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };

    const deleted = await this.model.findByIdAndDelete(id);
    if (!deleted) {
      result.error = true;
      result.code = 404;
      result.message = "Transaction not found";
    } else {
      result.message = "Transaction deleted successfully";
      result.data = deleted;
    }

    return result;
  }

  /**
   * @name slugExists
   * @param {string} slug
   * @returns {Promise<boolean>}
   * @description Check if a slug already exists
   */
  public async slugExists(slug: string): Promise<boolean> {
    const exists = await this.model.exists({ slug });
    return !!exists;
  }
}

export default new TransactionRepository();
