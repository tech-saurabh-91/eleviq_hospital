import { signInSchema, signupSchema } from "@/schema/auth";
import { forgotPasswordSchema } from "@/schema/auth";
import { z } from "zod";

export type SignupFormValues = z.infer<typeof signupSchema>;

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

// Type definitions
export type SignInFormValues = z.infer<typeof signInSchema>;
