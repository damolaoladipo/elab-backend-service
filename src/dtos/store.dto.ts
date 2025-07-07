export interface CreateStoreDTO {
  image?: string; // upload file
  name: string;
  price: number;
  discount?: number;
  description?: string;
  status?: string;
  category: string;
  excerpt?: string;
  url?: string;
  author?: string;
  color?: string;
  pageCount?: number;
  size?: string;
}

export interface UpdateStoreDTO extends Partial<CreateStoreDTO> {}
