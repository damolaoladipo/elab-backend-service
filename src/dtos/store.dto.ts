export interface CreateStoreDTO {
  name: string;
  price: number;
  discountedPrice?: number;
  image?: string; // upload file
  tags: string[];
  category: string;
  author?: string;
  excerpt?: string;
  description: string;
  url: string;
  status: string;
}

export interface UpdateStoreDTO extends Partial<CreateStoreDTO> {}
