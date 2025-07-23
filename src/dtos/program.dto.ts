import { IWysiwygContent } from "../utils/interface.util";

export interface CreateProgramDTO {
  title: string;
  slug: string;
  description: IWysiwygContent[];
  joinUrl?: string;
  partnerUrl?: string;
}

export interface UpdateProgramDTO {
  title?: string;
  slug?: string;
  image?: string;
  description?: IWysiwygContent[];
  joinUrl?: string;
  partnerUrl?: string;
}
