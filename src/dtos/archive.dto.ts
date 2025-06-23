import { ObjectId } from "mongoose";

export interface CreateArchiveDTO {
  title: string;
  image: string;
  excerpt?: string;
  description?: string;
  link?: string;
  content: string;
  author: string;
  category: string;
  tags?: Array<string>;
  type: string;
  user: ObjectId;
}

export interface UpdateArchiveDTO {
  title?: string;
  image?: string;
  excerpt?: string;
  description?: string;
  link?: string;
  content?: string;
  author?: string;
  category?: string;
  tags?: Array<string>;
  type?: string;
  user?: ObjectId;
}
