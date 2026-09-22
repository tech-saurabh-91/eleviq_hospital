"use client";

import { PATIENT_APPOINTMENT_API } from "@/helper/api";
import { Appointment, CreateAppointmentRequest } from "@/types/appoiment";
import api from "@/helper/axios";
import { useState } from "react";

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
      console.error("Error fetching appointment slots:", error);
      setError("Failed to fetch appointment slots");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (
    appointmentData: CreateAppointmentRequest
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(
        PATIENT_APPOINTMENT_API.CREATE,
        appointmentData
      );

      return response.data?.data ?? response.data;
    } catch (error) {
      console.error("Error creating appointment:", error);
      setError("Failed to create appointment");
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
  };
};