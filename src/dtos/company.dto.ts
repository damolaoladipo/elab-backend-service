import { ObjectId } from "mongoose";

export interface CreateCompanyDTO {
  name: string;
  description: string;
  logo: string;
  status: string;
  url: string;
  email: string;
  brochure: string;
  user: ObjectId;
}

export interface UpdateCompanyDTO {
  name?: string;
  description?: string;
  logo?: string;
  status?: string;
  url?: string;
  email?: string;
  brochure?: string;
  user?: ObjectId;
}
