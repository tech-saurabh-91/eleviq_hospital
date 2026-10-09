"use client";
import { IUser, IUserContextType } from "@/types/User";
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import api from "@/helper/axios";
import { PATIENT_AUTH_API, PATIENT_PROFILE_API } from "@/helper/api";

const UserContext = createContext<IUserContextType | undefined>(undefined);

export const organizationId = "cm7c5c96u0005ijpwi6t9idnz";

const mapPatientProfile = (profile: any): IUser => ({
  id: profile.patientId,
  email: profile.email,
  firstName: profile.firstName,
  lastName: profile.lastName,
  phoneNumber: profile.primaryPhone || profile.mobile || "",
  dateOfBirth: profile.dateOfBirth,
  gender: String(profile.gender || "OTHER").toUpperCase() as IUser["gender"],
  address: profile.address?.street || "",
  city: profile.address?.city || "",
  state: profile.address?.state || "",
  zipCode: profile.address?.zipCode || "",
  createdAt: profile.memberSince,
  updatedAt: profile.lastUpdated,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await api.get(PATIENT_PROFILE_API.GET);
      const profile = response.data?.data ?? response.data;
      const patient = mapPatientProfile(profile);

      setUser(patient);
      return patient;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const loadSession = async () => {
      await refreshUser();
      setIsLoadingUser(false);
    };

    loadSession();
  }, [refreshUser]);

  useEffect(() => {
    const clearExpiredSession = () => setUser(null);

    window.addEventListener("patient-session-expired", clearExpiredSession);
    return () => {
      window.removeEventListener("patient-session-expired", clearExpiredSession);
    };
  }, []);


  const handleSetUser = useCallback((userData: IUser | null) => {
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    return api.post(PATIENT_AUTH_API.LOGOUT).catch(() => undefined).then(() => {
      handleSetUser(null);
    });
  }, [handleSetUser]);

  const value = {
    user,
    setUser: handleSetUser,
    isLoadingUser,
    refreshUser,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
