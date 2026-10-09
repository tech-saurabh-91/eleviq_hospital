

export interface FamilyMember {
    familyMemberId: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    relationship: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
    insuranceCoverage: 'patient' | 'own';
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}
