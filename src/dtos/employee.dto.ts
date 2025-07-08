export interface CreateEmployeeDTO {
  name: string;
  role: string;
  image?: string;
  status?: string 
  socialLink?: string; 
}

export interface UpdateEmployeeDTO {
  name?: string;
  role?: string;
  image?: string;
  status?: string;
  socialLink?: string; // optional social media link
}
