"use client";

import { PATIENT_PAYMENT_API } from "@/helper/api";
import axios from "axios";
import { useState } from "react";

export const usePayment = () => {
  const [payment, setPayment] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaymentIntent = async (amount: number) => {
    setLoading(true);
    try {
      const response = await axios.post(`${PATIENT_PAYMENT_API.CREATE}`, {
        amount,
      });
      setPayment(response.data);
    } catch (error) {
      console.error("Error creating payment intent:", error);
      setError("Failed to create payment intent");
    }
  };

  return {
    payment,
    loading,
    error,
    createPaymentIntent,
  };
};
