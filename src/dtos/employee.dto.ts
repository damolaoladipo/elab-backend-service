export interface CreateEmployeeDTO {
  name: string;
  position: string;
  image?: string;
  status: string // optional until upload
}

export interface UpdateEmployeeDTO {
  name?: string;
  position?: string;
  image?: string;
  status?: string;
}
