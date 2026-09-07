"use client"

import { PATIENT_FAMILY_API } from "@/helper/api";
import { FamilyMember } from "@/types/familymember";
import axios from "axios";
import { useState } from "react";



export const useFamilyMember = () => {
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const getAllFamilyMembers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${PATIENT_FAMILY_API.GET_ALL}`)
            setFamilyMembers(response.data);
        } catch (error) {
            console.error("Error fetching family members:", error);
            setError("Failed to fetch family members");
        } finally {
            setLoading(false);
        }
    }

    const getFamilyMemberById = async (id: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`${PATIENT_FAMILY_API.GET_SINGLE(id)}`)
            return response.data;
        } catch (error) {
            console.error("Error fetching family member:", error);
            setError("Failed to fetch family member");
        } finally {
            setLoading(false);
        }
    }

    const createFamilyMember = async (familyMemberData: FamilyMember) => {
        setLoading(true);
        try {
            const response = await axios.post(`${PATIENT_FAMILY_API.ADD_FAMILY_MEMBER}`, familyMemberData)
            return response.data;
        } catch (error) {
            console.error("Error creating family member:", error);
            setError("Failed to create family member");
        } finally {
            setLoading(false);
        }
    }
    

    return {
        familyMembers,
        loading,
        error,
        getAllFamilyMembers,
        getFamilyMemberById,
        createFamilyMember
    }

}
