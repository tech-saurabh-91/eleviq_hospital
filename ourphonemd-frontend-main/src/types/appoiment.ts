import { z } from "zod";
import { appoimentFormSchema } from "@/schema/appoiment";


// Define appointment status types
export enum AppointmentStatus {
  BOOKED = "BOOKED",
  VERIFIED = "VERIFIED",
  CONFIRMED = "CONFIRMED",
}

// Define appointment types
export enum AppointmentType {
  CONSULTATION = 'CONSULTATION',
  CHECKUP = 'CHECKUP',
  FOLLOW_UP = 'FOLLOW_UP',
  PROCEDURE = 'PROCEDURE',
  EMERGENCY = 'EMERGENCY',
  TELEMEDICINE = 'TELEMEDICINE',
  LAB_WORK = 'LAB_WORK'
}

// Appointment request interface
export interface CreateAppointmentRequest {
  doctorId: string;
  familyMember?: string;
  appointmentType: string;
  appointmentDate: string;
  startTime: string;
  visitReason: string;
}

// Appointment response interface
export interface Appointment {
  appointmentId: string;

  doctor: {
    doctorId: string;
    username: string;
    mobile: string;
  } | null;

  appointmentFor:
  | {
    type: "FAMILY";
    familyMemberId?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    name?: string;
    relationship?: string;
  }
  | {
    type: "SELF";
  };

  appointmentType: string;

  appointmentDate: string;

  startTime: string;

  endTime: string;

  visitReason: string;

  status: AppointmentStatus;

  payment: {
    status: string;
    method?: string;
    amount?: number;
  };

  verifiedAt?: string | null;

  confirmedAt?: string | null;

  createdAt?: string;

  updatedAt?: string;
}



// Define the form type
export type BookAppoimentFormValues = z.infer<typeof appoimentFormSchema>;