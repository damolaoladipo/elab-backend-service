import { FilterQuery, Model, ObjectId } from "mongoose";
import Employee from "../models/Employee.model";
import { IEmployeeDoc, IResult } from "../utils/interface.util";

class EmployeeRepository {
  private model: Model<IEmployeeDoc>;

  constructor() {
    this.model = Employee;
  }

  /**
   * @name findById
   * @param id
   * @param populate
   * @returns {Promise<IEmployeeDoc | null>}
   * @description Find an employee by ID and optionally populate related data
   */
  public async findById(id: string, populate: boolean = false): Promise<IEmployeeDoc | null> {
    const dataPop = [{ path: "user" }];
    const pop = populate ? dataPop : [];

    const query: FilterQuery<IEmployeeDoc> = { _id: id };

    const employee = await this.model.findById(query).populate(pop);
    if (!employee) {
      return null;
    }

    return employee;
  }

  public async findBySlug(slug: string): Promise<IResult> {
  const result: IResult = {
    error: false,
    message: "",
    code: 200,
    data: {},
  };

  try {
    const employee = await this.model.findOne({ slug });

    if (!employee) {
      result.error = true;
      result.code = 404;
      result.message = "Employee not found";
      return result;
    }

    result.data = employee.toJSON();
    result.message = "Employee fetched successfully";
    return result;
  } catch (err: any) {
    result.error = true;
    result.code = 500;
    result.message = err.message;
    return result;
  }
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
