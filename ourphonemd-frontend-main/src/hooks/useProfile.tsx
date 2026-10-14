"use client";

import { PATIENT_PROFILE_API } from "@/helper/api";
import { IUser } from "@/types/User";
import api from "@/helper/axios";
import { useState } from "react";

export const useProfile = () => {
  const [profile, setProfile] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(PATIENT_PROFILE_API.GET);
      const data = response.data?.data ?? response.data;
      setProfile(data);
      return data;
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      const message = err?.response?.data?.message || "Failed to fetch profile";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<IUser> | Record<string, any>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch(
        PATIENT_PROFILE_API.UPDATE,
        profileData
      );
      const data = response.data?.data ?? response.data;
      setProfile(data);
      return data;
    } catch (err: any) {
      console.error("Error updating profile:", err);
      const message = err?.response?.data?.message || "Failed to update profile";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    getProfile,
    updateProfile,
  };
};
