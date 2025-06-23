import { PasswordType, UserType } from "../utils/enums.util";

export interface inviteUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: UserType;
  role?: string;
  permissions?: Array<string>;
}

export interface createUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordType: PasswordType;
  userType: UserType;
  createdBy?: string
  role?: string;
  permissions?: Array<string>;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
};
}

export interface EditUserDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  phoneCode?: string;
  country?: string;
  avatar?: string;
  dateOfBirth?: Date;
  gender?: string;
  isActive?: boolean;
}