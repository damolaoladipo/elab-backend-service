import { IWysiwygContent } from "../utils/interface.util";

export interface CreateCompanyDTO {
  name: string;
  description: IWysiwygContent;
  status: string;
  websiteUrl: string;
  brochureUrl: string;
  contact: string;
  logo: string; // file upload
}
export interface UpdateCompanyDTO {
  name?: string;
  description?: IWysiwygContent;
  status?: string;
  websiteUrl?: string;
  brochureUrl?: string;
  contact?: string;
  logo?: string; // file upload
}
