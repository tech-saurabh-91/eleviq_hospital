

export interface FamilyMember {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    gender: 'Male' | 'Female' | 'Other';
    relationship: string;
    insurance?: any
    createdAt: string;
    updatedAt: string;
  }