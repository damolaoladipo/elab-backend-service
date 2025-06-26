import { ObjectId } from "mongoose";
import { IUserDoc, IWysiwygContent } from "../utils/interface.util";

export interface CreateProjectDTO {
  title: string;
  content: IWysiwygContent;
  websiteUrl?: string;
  volunteerUrl?: string;
  partnerUrl?: string;
  sponsorUrl?: string;
  image?: string; // S3 URL will be added after upload
  user: IUserDoc | ObjectId;
}

export interface UpdateProjectDTO {
  title?: string;
  content?: IWysiwygContent;
  websiteUrl?: string;
  volunteerUrl?: string;
  partnerUrl?: string;
  sponsorUrl?: string;
  image?: string; 
  user: IUserDoc | ObjectId;
}
