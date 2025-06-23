import { ObjectId } from "mongoose";

export interface CreateResourceDTO {
  title: string;
  image: string;
  description: string;
  resource: string;
  type: string;
  author: string;
  category: string;
  tags?: Array<string>;
  user: ObjectId;
}

export interface UpdateResourceDTO {
  title?: string;
  image?: string;
  description?: string;
  resource?: string;
  type?: string;
  author?: string;
  category?: string;
  tags?: Array<string>;
  user?: ObjectId;
}
