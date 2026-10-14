import { z } from "zod";

// Sign in schema
export const signInSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Username, mobile or email is required"),

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
  email: z.string().trim().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

  // Profile Creation (Step 4)
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name must be 50 characters or less")
    .regex(/^[A-Za-zÀ-ÿ\s'-]+$/, "First name contains invalid characters"),

  middleName: z
    .string()
    .trim()
    .max(50, "Middle name must be 50 characters or less")
    .regex(/^[A-Za-zÀ-ÿ\s'-]*$/, "Middle name contains invalid characters")
    .optional()
    .or(z.literal("")),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name must be 50 characters or less")
    .regex(/^[A-Za-zÀ-ÿ\s'-]+$/, "Last name contains invalid characters"),

  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  ssn: z.string().optional(),

  primaryPhone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Primary phone must be a valid 10-digit Indian mobile number"),

  secondaryPhone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Secondary phone must be a valid 10-digit Indian mobile number")
    .optional()
    .or(z.literal("")),

  streetAddress: z.string().trim().min(1, "Street address is required"),
  city: z.string().trim().min(2, "City must contain at least 2 characters"),
  state: z.string().trim().min(2, "State must contain at least 2 characters"),
  zipCode: z
    .string()
    .trim()
    .regex(/^[1-9]\d{5}$/, "PIN code must contain 6 digits and cannot start with 0"),

  informationConfirmed: z.boolean().refine((val) => val === true, {
    message: "Please confirm that all entered information is correct",
  }),

  // Verification (Step 5)
  verificationMethod: z.enum(["email", "phone"]).nullable(),
  emailVerificationCode: z.string().optional(),
  phoneVerificationCode: z.string().optional(),

  // Insurance details (Step 6)
  insuranceType: z
    .string()
    .trim()
    .min(1, "Insurance type is required"),

  insuranceProvider: z
    .string()
    .trim()
    .min(1, "Insurance provider is required"),

  insuranceId: z
    .string()
    .trim()
    .min(1, "Insurance ID is required"),

  policyNumber: z
    .string()
    .trim()
    .min(1, "Policy number is required"),

  groupNumber: z
    .string()
    .trim()
    .optional(),

  ediPayer: z
    .string()
    .trim()
    .optional(),

  coverageType: z
    .string()
    .trim()
    .min(1, "Coverage type is required"),

  effectiveDate: z
    .string()
    .min(1, "Effective date is required"),

  isPrimary: z
    .boolean()
    .default(false),

  frontCardImage: z
    .any()
    .optional(),

  backCardImage: z
    .any()
    .optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
});

// Form validation schema
export const editProfileformSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .regex(/^[A-Za-zÀ-ÿ\s'-]+$/, "Name contains invalid characters"),

  relationship: z.string({ required_error: "Please select a relationship." }),
  dateOfBirth: z.string({ required_error: "Date of birth is required." }),
  gender: z.string({ required_error: "Please select a gender." }),
  email: z.string().trim().email("Invalid email address").optional().or(z.literal("")),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number")
    .optional()
    .or(z.literal("")),

  hasInsurance: z.boolean().default(false),
  insuranceProvider: z.string().optional().or(z.literal("")),
  policyNumber: z.string().optional().or(z.literal("")),
});