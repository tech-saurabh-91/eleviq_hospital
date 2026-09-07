"use client";

import { PATIENT_MEDICAL_RECORDS_API } from "@/helper/api";
import axios from "axios";
import { useState } from "react";

export const useMedicalRecords = () => {
  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllMedicalRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${PATIENT_MEDICAL_RECORDS_API.GET_ALL}`
      );
      setMedicalRecords(response.data);
    } catch (error) {
      console.error("Error fetching medical records:", error);
      setError("Failed to fetch medical records");
    } finally {
      setLoading(false);
    }
  };

  const getMedicalRecordById = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${PATIENT_MEDICAL_RECORDS_API.GET_SINGLE(id)}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching medical record:", error);
      setError("Failed to fetch medical record");
    } finally {
      setLoading(false);
    }
  };

  return {
    medicalRecords,
    loading,
    error,
    getAllMedicalRecords,
    getMedicalRecordById,
  };
};
