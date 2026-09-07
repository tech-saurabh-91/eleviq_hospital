"use client";

import { PATIENT_PROFILE_API } from "@/helper/api";
import { IUser } from "@/types/User";
import axios from "axios";
import { useState } from "react";

export const useProfile = () => {
  const [profile, setProfile] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${PATIENT_PROFILE_API.GET}`);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: IUser) => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `${PATIENT_PROFILE_API.UPDATE}`,
        profileData
      );
      setProfile(response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
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
