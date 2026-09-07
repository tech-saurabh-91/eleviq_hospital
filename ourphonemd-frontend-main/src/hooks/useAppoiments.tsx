"use client"
import { PATIENT_APPOINTMENT_API } from "@/helper/api";
import { Appointment, CreateAppointmentRequest } from "@/types/appoiment";
import axios from "axios";
import { useState } from "react";




export const useAppointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getAllAppointments = async () => {
        setLoading(true);
        try {
            const response =  await axios.get(`${PATIENT_APPOINTMENT_API.GET_ALL}`)        
            setAppointments(response.data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
            setError("Failed to fetch appointments");
        } finally {
            setLoading(false);
        }
    }   

    const getAvailableAppointmentSlots = async (id: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`${PATIENT_APPOINTMENT_API.GET_AVAILABLE_APPOINTMENT_SLOTS(id)}`)
            return response.data;
        } catch (error) {
            console.error("Error fetching appointment slots:", error);
            setError("Failed to fetch appointment");
        } finally {
            setLoading(false);
        }
    }

    const createAppointment = async (appointmentData: CreateAppointmentRequest) => {
        setLoading(true);
        try {
            const response = await axios.post(`${PATIENT_APPOINTMENT_API.CREATE}`, appointmentData)
            return response.data;
        } catch (error) {
            console.error("Error creating appointment:", error);
            setError("Failed to create appointment");
        } finally {
            setLoading(false);
        }
    }   

    const deleteAppointment = async (id: string) => {
        setLoading(true);
        try {
            const response = await axios.delete(`${PATIENT_APPOINTMENT_API.DELETE(id)}`)
            return response.data;
        } catch (error) {
            console.error("Error deleting appointment:", error);
            setError("Failed to delete appointment");
        } finally {
            setLoading(false);
        }
    }

    return {
        appointments,
        loading,
        error,
        getAllAppointments,
        getAvailableAppointmentSlots,
        createAppointment,
        deleteAppointment
    }
}