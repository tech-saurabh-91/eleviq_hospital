import { IUser } from "./User";


export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export interface Patient {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email?: string;
  contactNumber: string;
  alternativeContactNumber?: string;
  socialSecurityNumber?: string;
  dateOfBirth: string;
  gender: Gender;
  relation?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  profilePicture?: string;
  organizationId: string;
  parentId?: string;
  parent?: Patient;
  familyMembers?: Patient[];
  createdAt: string;
  updatedAt: string;
  createdById: string;
  createdBy?: IUser;
  isDeleted: boolean;
  deletedAt?: string;
  deletedById?: string;
  deletedBy?: IUser;
  _count?: {
    familyMembers?: number;
  };
}