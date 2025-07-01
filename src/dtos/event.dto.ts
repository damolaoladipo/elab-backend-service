import { ObjectId } from "mongoose";
import { IWysiwygContent } from "../utils/interface.util";

export interface CreateEventDTO {
  title: string;
  content: IWysiwygContent[];
  features?: IWysiwygContent[];
  joinUrl?: string;
  planUrl?: string;
  sponsorUrl?: string;
  communityUrl?: string;
}

export interface UpdateEventDTO {
   title?: string;
  content?: IWysiwygContent[];
  features?: IWysiwygContent[];
  joinUrl?: string;
  planUrl?: string;
  sponsorUrl?: string;
  communityUrl?: string;
}
