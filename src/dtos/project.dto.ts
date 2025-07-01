import { IWysiwygContent } from "../utils/interface.util";

export interface CreateProjectDTO {
  title: string;
  content: IWysiwygContent;
  websiteUrl?: string;
  volunteerUrl?: string;
  partnerUrl?: string;
  sponsorUrl?: string;
  image?: string; 
}

export interface UpdateProjectDTO {
  title?: string;
  content?: IWysiwygContent;
  websiteUrl?: string;
  volunteerUrl?: string;
  partnerUrl?: string;
  sponsorUrl?: string;
  image?: string; 
}
