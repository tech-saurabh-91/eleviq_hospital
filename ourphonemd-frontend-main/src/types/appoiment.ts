import { z } from "zod";
import { Patient } from "./patient";
import { IUser } from "./User";
import { appoimentFormSchema } from "@/schema/appoiment";


// Define appointment status types
export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
  RESCHEDULED = 'RESCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS'
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
  startTime: string;
  appointmentType: AppointmentType;
  patientId: string;
  reason: string;
}

// Appointment response interface
export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  type: AppointmentType;
  reason: string;
  createdAt: string;
  updatedAt: string;
  // Additional fields for UI
  title?: string;
  symptoms?: string;
  medications?: string;
  notes?: string;
  patient?: Patient;
  organizationId?: string;
  createdById?: string;
  createdBy?: IUser;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedById?: string;
  deletedBy?: IUser;
  resourceId?: string; // Doctor ID
  roomId?: string;
  recurringId?: string; // For recurring appointments
}



// Define the form type
export type BookAppoimentFormValues = z.infer<typeof appoimentFormSchema>;