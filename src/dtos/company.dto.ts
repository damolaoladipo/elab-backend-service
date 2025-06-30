export interface CreateCompanyDTO {
  name: string;
  description: string;
  status: string;
  url: string;
  email: string;
  brochure?: string;
}

export interface UpdateCompanyDTO {
  name?: string;
  description?: string;
  status?: string;
  url?: string;
  email?: string;
  brochure?: string;

}
