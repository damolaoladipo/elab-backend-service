import { ObjectId } from "mongoose";

export interface CreateProjectDTO {
  name: string;
  image: string;
  description: string;
  startDate: Date;
  user: ObjectId;
}

export interface UpdateProjectDTO {
  name?: string;
  image?: string;
  description?: string;
  startDate?: Date;
  user?: ObjectId;
}
