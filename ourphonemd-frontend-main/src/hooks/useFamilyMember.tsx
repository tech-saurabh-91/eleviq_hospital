"use client";

import { PATIENT_FAMILY_API } from "@/helper/api";
import { FamilyMember } from "@/types/familymember";
import api from "@/helper/axios";
import { useState } from "react";

export const useFamilyMember = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllFamilyMembers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(
        PATIENT_FAMILY_API.GET_ALL
      );

      const data = response.data?.data ?? response.data ?? [];

      setFamilyMembers(data);

      return data;
    } catch (error) {
      console.error("Error fetching family members:", error);
      setError("Failed to fetch family members");

      return [];
    } finally {
      setLoading(false);
    }
  };

  const getFamilyMemberById = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(
        PATIENT_FAMILY_API.GET_SINGLE(id)
      );

      return response.data?.data ?? response.data;
    } catch (error) {
      console.error("Error fetching family member:", error);
      setError("Failed to fetch family member");

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createFamilyMember = async (familyMemberData: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(
        PATIENT_FAMILY_API.CREATE,
        familyMemberData
      );

      return response.data?.data ?? response.data;
    } catch (error) {
      console.error("Error creating family member:", error);
      setError("Failed to create family member");

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteFamilyMember = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.delete(
        PATIENT_FAMILY_API.DELETE(id)
      );

      setFamilyMembers((current) =>
        current.filter(
          (member: any) =>
            member.familyMemberId !== id
        )
      );

      return response.data;
    } catch (error) {
      console.error("Error deleting family member:", error);
      setError("Failed to delete family member");

      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    familyMembers,
    loading,
    error,
    getAllFamilyMembers,
    getFamilyMemberById,
    createFamilyMember,
    deleteFamilyMember,
  };
};