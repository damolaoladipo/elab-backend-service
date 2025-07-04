import { IWysiwygContent } from "../utils/interface.util";

export interface CreateArchiveDTO {
  title: string;
  category: string;
  content?: IWysiwygContent;
  link?: string;
  author?: string;
  tags: Array<string>;
  status: string
}

export interface UpdateArchiveDTO {
  title?: string;
  category?: string;
  content?: IWysiwygContent;
  link?: string;
  author?: string;
  tags?: Array<string>;
  status?: string
}
