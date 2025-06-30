import { IWysiwygContent } from "../utils/interface.util";

export interface CreateArchiveDTO {
  title: string;
  excerpt: string;
  category: string;
  content?: IWysiwygContent;
  link?: string;
  author?: string;
  tags: Array<string>;
  status: string
}

export interface UpdateArchiveDTO {
  title?: string;
  excerpt?: string;
  category?: string;
  content?: IWysiwygContent;
  link?: string;
  author?: string;
  tags?: Array<string>;
  status?: string
}
