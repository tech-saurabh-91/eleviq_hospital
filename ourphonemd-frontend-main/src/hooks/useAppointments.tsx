"use client";

import { PATIENT_APPOINTMENT_API } from "@/helper/api";
import { Appointment } from "@/types/appoiment";
import api from "@/helper/axios";
import { useState } from "react";

export interface CreateAppointmentData {
  doctorId: string;
  familyMemberId?: string;
  appointmentType: string;
  appointmentDate: string;
  startTime: string;
  visitReason: string;
}

export interface RescheduleAppointmentData {
  appointmentDate: string;
  startTime: string;
}

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllAppointments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(
        PATIENT_APPOINTMENT_API.GET_ALL
      );

      const data = response.data?.data ?? response.data ?? [];

      setAppointments(data);

      return data;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to fetch appointments");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getAvailableDoctors = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(
        PATIENT_APPOINTMENT_API.GET_DOCTORS
      );

      return response.data?.data ?? response.data ?? [];
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setError("Failed to fetch doctors");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getAvailableAppointmentSlots = async (
    doctorId: string,
    appointmentDate: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(
        PATIENT_APPOINTMENT_API.GET_AVAILABLE_APPOINTMENT_SLOTS,
        {
          params: {
            doctorId,
            appointmentDate,
          },
        }
      );

      return response.data?.data ?? response.data ?? [];
    } catch (error) {
      console.error(
        "Error fetching appointment slots:",
        error
      );

      setError("Failed to fetch appointment slots");

      return [];
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (
    appointmentData: CreateAppointmentData
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(
        PATIENT_APPOINTMENT_API.CREATE,
        appointmentData
      );

      const data =
        response.data?.data ?? response.data;

      return data;
    } catch (error) {
      console.error(
        "Error creating appointment:",
        error
      );

      setError("Failed to create appointment");

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const rescheduleAppointment = async (
    appointmentId: string,
    appointmentData: RescheduleAppointmentData
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.patch(
        PATIENT_APPOINTMENT_API.RESCHEDULE(
          appointmentId
        ),
        appointmentData
      );

      const data =
        response.data?.data ?? response.data;

      return data;
    } catch (error) {
      console.error(
        "Error rescheduling appointment:",
        error
      );

      setError("Failed to reschedule appointment");

      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    appointments,
    loading,
    error,

    getAllAppointments,
    getAvailableDoctors,
    getAvailableAppointmentSlots,
    createAppointment,
    rescheduleAppointment,
  };
};