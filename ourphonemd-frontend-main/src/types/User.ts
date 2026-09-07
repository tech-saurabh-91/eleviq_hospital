export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: Gender;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  name?: string;
  role?: string;
  status?: string;

}




export interface IUserContextType {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  logout: () => void;
}

export interface RegisterUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    accountType: string;
    username: string;
    mobile: string;
    roles: string[];
  };
}
