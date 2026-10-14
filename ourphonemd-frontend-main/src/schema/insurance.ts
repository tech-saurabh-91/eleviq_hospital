import { z } from "zod";

export const insuranceFormSchema = z.object({
  insuranceType: z.string().min(1, { message: "Insurance type is required." }),
  insuranceProvider: z.string().min(1, { message: "Insurance provider is required." }),
  customProvider: z.string().optional(),
  insuranceId: z.string().min(1, { message: "Insurance ID / Member ID is required." }),
  policyNumber: z.string().min(1, { message: "Policy number is required." }),
  groupNumber: z.string().optional(),
  ediPayer: z.string().optional(),
  coverageType: z.string().min(1, { message: "Coverage type is required." }),
  effectiveDate: z.string().min(1, { message: "Effective date is required." }),
  expiryDate: z.string().optional(),
  relationship: z.string().min(1, { message: "Please select a relationship." }),
  isPrimary: z.boolean().default(false),

  // Indian HMS Fields
  tpa: z.string().optional(),
  customTpa: z.string().optional(),
  planName: z.string().optional(),
  policyType: z.string().optional(),
  policyHolderName: z.string().optional(),
  sumInsured: z.string().optional(),
  remainingSumInsured: z.string().optional(),
  roomRentLimit: z.string().optional(),
  copay: z.string().optional(),
  deductible: z.string().optional(),
  coverageRestrictions: z.string().optional(),

  // Group / Employer Insurance
  employerName: z.string().optional(),
  employeeId: z.string().optional(),

  // Government Schemes
  schemeName: z.string().optional(),
  beneficiaryId: z.string().optional(),

  // Legacy / optional subscriber fields
  subscriberName: z.string().optional(),
  subscriberCopay: z.string().optional(),
  subscriberSsn: z.string().optional(),
  subscriberDateOfBirth: z.string().optional(),
  subscriberAddress: z.string().optional(),
});

export type InsuranceFormData = z.infer<typeof insuranceFormSchema>;