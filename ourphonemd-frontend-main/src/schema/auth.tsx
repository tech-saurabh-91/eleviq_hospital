import { z } from "zod";


// sign in schema
// Zod schema
export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});



export const signupSchema = z.object({
    // Terms acceptance (Step 1)
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  
    // Age Verification (Step 2) - can be true, false, or null
    isAdult: z.boolean().nullable(),
  
    // Prerequisites (Step 3) - explicitly define as boolean with defaults
    hasInsuranceCard: z.boolean(),
    hasPharmacyInfo: z.boolean(),
    hasMedicalRecords: z.boolean(),
    hasEmergencyContact: z.boolean(),
  
    // Account Creation (now part of Step 4)
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  
    // Profile Creation (Step 4)
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    gender: z.string().min(1, "Gender is required"),
    ssn: z.string().optional(),
    primaryPhone: z.string().min(1, "Primary phone number is required"),
    secondaryPhone: z.string().optional(),
    streetAddress: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "ZIP code is required"),
  
    // Verification (Step 5)
    emailVerificationCode: z.string().min(1, "Email verification code is required"),
    phoneVerificationCode: z.string().min(1, "Phone verification code is required"),
  
    // Insurance details (Step 6)
    insuranceProvider: z.string().optional(),
    memberId: z.string().optional(),
    groupNumber: z.string().optional(),
    policyHolderName: z.string().optional(),
    
    // Additional insurance fields
    userType: z.string().optional(),
    relationship: z.string().optional(),
    memberName: z.string().optional(),
    insuranceId: z.string().optional(),
    frontCard: z.any().optional(),
    backCard: z.any().optional(),
    effectiveDate: z.string().optional(),
    subscriberName: z.string().optional(),
    subscriberDob: z.string().optional(),
    subscriberSsn: z.string().optional(),
    subscriberCopay: z.string().optional(),
    subscriberAddress: z.string().optional(),
    ediPayer: z.string().optional(),
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Form validation schema
export const editProfileformSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  relationship: z.string({ required_error: "Please select a relationship." }),
  dateOfBirth: z.string({ required_error: "Date of birth is required." }),
  gender: z.string({ required_error: "Please select a gender." }),
  email: z.string().email({ message: "Invalid email address." }).optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  hasInsurance: z.boolean().default(false),
  insuranceProvider: z.string().optional().or(z.literal("")),
  policyNumber: z.string().optional().or(z.literal("")),
});