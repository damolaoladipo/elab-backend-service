export interface CreateEmployeeDTO {
  name: string;
  role: string;
  image?: string;
  status: string // optional until upload
}

export interface UpdateEmployeeDTO {
  name?: string;
  role?: string;
  image?: string;
  status?: string;
}
