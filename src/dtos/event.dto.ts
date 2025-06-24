import { ObjectId } from "mongoose";

export interface CreateEventDTO {
  name: string;
  eventType: string;
  lcoation: string;
  image: string;
  description: string;
  features?: Array<string>;
  startDate: Date;
  endDate: Date;
  userId: ObjectId;
}

export interface UpdateEventDTO {
  name?: string;
  eventType?: string;
  lcoation?: string;
  image?: string;
  description?: string;
  features?: Array<string>;
  startDate?: Date;
  endDate?: Date;
  userId: ObjectId;
}
