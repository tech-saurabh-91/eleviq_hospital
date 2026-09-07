import { AppointmentType } from "@/types/appoiment";
import { z } from "zod";


// Define the form schema
export const appoimentFormSchema = z.object({
    doctorId: z.string(),
    startTime: z.string(),
    appointmentType: z.nativeEnum(AppointmentType),
    patientId: z.string(),
    reason: z.string().min(1, "Reason is required"),
    symptoms: z.string().optional(),
    medications: z.string().optional(),
    notes: z.string().optional(),
    isVideoCall: z.boolean().default(true),
    roomId: z.string().optional(),
    cardNumber: z.string().optional(),
    cardName: z.string().optional(),
    expiryDate: z.string().optional(),
    cvv: z.string().optional(),
  });