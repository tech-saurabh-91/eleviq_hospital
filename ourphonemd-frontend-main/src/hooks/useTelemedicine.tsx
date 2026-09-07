"use client";

import { PATIENT_TELEMEDICINE_API } from "@/helper/api";
import axios from "axios";
import { useState } from "react";

export const useTelemedicine = () => {
  const [telemedicine, setTelemedicine] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTelemedicine = async (appointmentId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${PATIENT_TELEMEDICINE_API.GET(appointmentId)}`
      );
      setTelemedicine(response.data);
    } catch (error) {
      console.error("Error fetching telemedicine:", error);
      setError("Failed to fetch telemedicine");
    } finally {
      setLoading(false);
    }
  };

  return {
    telemedicine,
    loading,
    error,
    getTelemedicine,
  };
};
