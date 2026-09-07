import { z } from "zod";


export const insuranceFormSchema = z.object({
  provider: z.string({ required_error: "Insurance provider is required." }),
  customProvider: z.string().optional(),
  policyNumber: z.string().min(5, { message: "Policy number must be at least 5 characters." }),
  groupNumber: z.string().optional(),
  policyHolderName: z.string().min(2, { message: "Policy holder name is required." }),
  relationshipToMember: z.string({ required_error: "Please select a relationship." }),
  startDate: z.string().optional(),
});