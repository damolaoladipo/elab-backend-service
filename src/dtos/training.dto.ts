import { IWysiwygContent } from "../utils/interface.util";

export interface CreateTrainingDTO {
  title: string;
  slug: string;
  subtitle: string;
  image?: string;
  description: IWysiwygContent[];
  outcome: IWysiwygContent[];
  cta: string;
}

export interface UpdateTrainingDTO {
  title?: string;
  slug?: string;
  subtitle?: string;
  image?: string;
  description?: IWysiwygContent[];
  outcome?: IWysiwygContent[];
  cta?: string;
}
