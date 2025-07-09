import { FilterQuery, Model, ObjectId } from "mongoose";
import Employee from "../models/Employee.model";
import { IEmployeeDoc, IResult } from "../utils/interface.util";
import mongoose from "mongoose";

class EmployeeRepository {
  private model: Model<IEmployeeDoc>;

  constructor() {
    this.model = Employee;
  }

  /**
   * @name findEmployee
   * @param {string} input - The ObjectId or slug of the employee.
   * @returns {Promise<IResult>} Result object containing the employee data or error information.
   * @description Fetch an employee by its ObjectId or slug.
   */
  public async findEmployee(input: string): Promise<IResult> {
  const result: IResult = {
    error: false,
    message: "",
    code: 200,
    data: {},
  };

     const isValidObjectId =
      mongoose.Types.ObjectId.isValid(input) &&
      new mongoose.Types.ObjectId(input).toString() === input;

    const employee = isValidObjectId
      ? await this.model.findById(input)
      : await this.model.findOne({ slug: input });
    if (!employee) {
      result.error = true;
      result.code = 404;
      result.message = "Employee not found";
      return result;
    }

    result.data = employee.toJSON();
    result.message = "Employee fetched successfully";
    return result;
}


  /**
   * @name getEmployees
   * @returns {Promise<IResult>}
   * @description Get all employees
   */
  public async getEmployees(): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };
    const employees = await this.model.find({}).lean();
    if (!employees || employees.length === 0) {
      result.error = true;
      result.code = 404;
      result.message = "No employees found";
      return result;
    }
    result.message = "Employees fetched successfully";
    result.code = 200;
    result.data = employees;
    return result;
  }

  /**
   * @name getUserEmployees
   * @param userId
   * @returns {Promise<IResult>}
   * @description Get all employees created by a specific user
   */
  public async getUserEmployees(userId: string | ObjectId): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const employees = await this.model.find({ user: userId }).lean();
    if (!employees || employees.length === 0) {
      result.error = true;
      result.code = 404;
      result.message = "No employees found for this user";
      return result;
    }

    result.message = "User's employees fetched successfully";
    result.code = 200;
    result.data = employees;
    return result;
  }

  /**
   * @name createEmployee
   * @param employeeData
   * @returns {Promise<IResult>}
   * @description Create a new employee
   */
  public async createEmployee(employeeData: Partial<IEmployeeDoc>): Promise<IResult> {
    let result: IResult = { error: false, message: "Employee created successfully", code: 201, data: {} };
    const newEmployee = await this.model.create(employeeData);
    if (!newEmployee) {
      result.error = true;
      result.code = 500;
      result.message = "Failed to create employee";
      return result;
    }
    result.data = newEmployee.toJSON();
    return result;
  }

  /**
   * @name updateEmployee
   * @param id
   * @param updateData
   * @returns {Promise<IResult>}
   * @description Update an existing employee
   */
  public async updateEmployee(id: string, updateData: Partial<IEmployeeDoc>): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };
    const updatedEmployee = await this.model.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedEmployee) {
      result.error = true;
      result.code = 404;
      result.message = "Employee not found";
    } else {
      result.message = "Employee updated successfully";
      result.data = updatedEmployee.toJSON();
    }
    return result;
  }

  /**
   * @name deleteEmployee
   * @param id
   * @returns {Promise<IResult>}
   * @description Delete an employee by ID
   */
  public async deleteEmployee(id: string): Promise<IResult> {
    
    let result: IResult = { error: false, message: "", code: 200, data: {} };
    
    const deletedEmployee = await this.model.findByIdAndDelete(id);
    if (!deletedEmployee) {
      result.error = true;
      result.code = 404;
      result.message = "Employee not found";
    } else {
      result.message = "Employee deleted successfully";
      result.data = deletedEmployee;
    }
    return result;
  }
}

export default new EmployeeRepository();
