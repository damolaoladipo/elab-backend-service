import Employee from "../models/Employee.model";
import { IEmployeeDoc } from "../utils/interface.util";
import { IResult } from "../utils/interface.util";

class EmployeeRepository {
  private model = Employee;

  async createEmployee(data: Partial<IEmployeeDoc>): Promise<IResult> {
    const doc = await this.model.create(data);
    return { error: false, message: "Created", code: 201, data: doc.toJSON() };
  }

  async updateEmployee(id: string, update: Partial<IEmployeeDoc>): Promise<IResult> {
    const doc = await this.model.findByIdAndUpdate(id, update, { new: true });
    if (!doc) return { error: true, message: "Not found", code: 404, data: {} };
    return { error: false, message: "Updated", code: 200, data: doc.toJSON() };
  }

  async findById(id: string): Promise<IResult> {
    const doc = await this.model.findById(id);
    if (!doc) return { error: true, message: "Not found", code: 404, data: {} };
    return { error: false, message: "Found", code: 200, data: doc.toJSON() };
  }

  async getAll(): Promise<IResult> {
    const list = await this.model.find().sort({ createdAt: -1 });
    return { error: false, message: "Fetched", code: 200, data: list.map(d => d.toJSON()) };
  }

  async deleteEmployee(id: string): Promise<IResult> {
    const doc = await this.model.findByIdAndDelete(id);
    if (!doc) return { error: true, message: "Not found", code: 404, data: {} };
    return { error: false, message: "Deleted", code: 200, data: {} };
  }
}

export default new EmployeeRepository();
