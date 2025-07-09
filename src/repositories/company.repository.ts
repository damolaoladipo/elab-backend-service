import mongoose, { FilterQuery, Model, ObjectId } from "mongoose";
import Company from "../models/Company.model";
import { IVentureDoc, IResult } from "../utils/interface.util";

class CompanyRepository {
  private model: Model<IVentureDoc>;

  constructor() {
    this.model = Company;
  }

  

  /**
   * @name findCompany
   * @param input - The ObjectId or slug of the company.
   * @returns {Promise<IResult>} Result object containing the company data or error information.
   * @description Fetch a company by its ObjectId or slug.
   */
  public async findCompany(input: string): Promise<IResult> {
    const result: IResult = {
      error: false,
      message: "",
      code: 200,
      data: {},
    };

    const isValidObjectId =
      mongoose.Types.ObjectId.isValid(input) &&
      new mongoose.Types.ObjectId(input).toString() === input;

    const company = isValidObjectId
      ? await this.model.findById(input)
      : await this.model.findOne({ slug: input });

    if (!company) {
      result.error = true;
      result.code = 404;
      result.message = "Company not found";
      return result;
    }

    result.data = company.toJSON();
    result.message = "Company fetched successfully";
    return result;
  }

  /**
   * @name getCompanies
   * @returns {Promise<IResult>}
   * @description Get all companies
   */
  public async getCompanies(): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };
    const companies = await this.model.find({}).lean();
    if (!companies || companies.length === 0) {
      result.error = true;
      result.code = 404;
      result.message = "No companies found";
      return result;
    }
    result.message = "Companies fetched successfully";
    result.code = 200;
    result.data = companies;
    return result;
  }

  /**
   * @name getUserCompanies
   * @param userId
   * @returns {Promise<IResult>}
   * @description Get all companies for a specific user
   */
  public async getUserCompanies(userId: string | ObjectId): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const companies = await this.model.find({ user: userId }).lean();
    if (!companies || companies.length === 0) {
      result.error = true;
      result.code = 404;
      result.message = "No companies found for this user";
      return result;
    }
    result.message = "User companies fetched successfully";
    result.code = 200;
    result.data = companies;
    return result;
  }

  /**
   * @name createCompany
   * @param companyData
   * @returns {Promise<IResult>}
   * @description Create a new company
   */
  public async createCompany(
    companyData: Partial<IVentureDoc>
  ): Promise<IResult> {
    let result: IResult = {
      error: false,
      message: "Company created successfully",
      code: 201,
      data: {},
    };
    const newCompany = await this.model.create(companyData);
    if (!newCompany) {
      result.error = true;
      result.code = 500;
      result.message = "Failed to create company";
      return result;
    }
    result.message = "Company created successfully";
    result.data = newCompany.toJSON();
    return result;
  }

  /**
   * @name updateCompany
   * @param id
   * @param updateData
   * @returns {Promise<IResult>}
   * @description Update an existing company
   */
  public async updateCompany(
    id: string,
    updateData: Partial<IVentureDoc>
  ): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };
    const updatedCompany = await this.model.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedCompany) {
      result.error = true;
      result.code = 404;
      result.message = "Company not found";
    } else {
      result.message = "Company updated successfully";
      result.data = updatedCompany.toJSON();
    }
    return result;
  }

  /**
   * @name deleteCompany
   * @param id
   * @returns {Promise<IResult>}
   * @description Delete a company by ID
   */
  public async deleteCompany(id: string): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };
    const deletedCompany = await this.model.findByIdAndDelete(id);
    if (!deletedCompany) {
      result.error = true;
      result.code = 404;
      result.message = "Company not found";
    } else {
      result.message = "Company deleted successfully";
      result.data = deletedCompany;
    }
    return result;
  }
}

export default new CompanyRepository();
