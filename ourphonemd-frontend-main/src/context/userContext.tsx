"use client";
import { IUser, IUserContextType } from "@/types/User";
import { createContext, useContext, useState, useCallback } from "react";

const UserContext = createContext<IUserContextType | undefined>(undefined);

export const organizationId = "cm7c5c96u0005ijpwi6t9idnz";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(() => ({
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    email: "user@example.com",
    firstName: "Jhon",
    lastName: "Dev",
    phoneNumber: "12345678900",
    dateOfBirth: "2025-05-21",
    gender: "MALE",
    address: "xyz karachi sindh PK",
    city: "karachi",
    state: "abcd",
    zipCode: "99999",
    createdAt: "2025-05-21T15:07:08.885Z",
    updatedAt: "2025-05-21T15:07:08.885Z",
  }));


  const handleSetUser = useCallback((userData: IUser | null) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  }, []);

  const logout = useCallback(() => {
    handleSetUser(null);
    localStorage.removeItem("token");
    // Add any additional cleanup here
  }, [handleSetUser]);

  const value = {
    user,
    setUser: handleSetUser,
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
