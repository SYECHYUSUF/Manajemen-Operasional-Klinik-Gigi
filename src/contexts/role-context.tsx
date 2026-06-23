"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getRoleFromToken, clearToken } from "@/lib/api-client";
import { useRouter } from "next/navigation";

type Role = "admin" | "doctor" | "cashier" | null;

interface RoleContextType {
  role: Role;
  isLoading: boolean;
  isAdmin: boolean;
  isDoctor: boolean;
  isCashier: boolean;
  logout: () => void;
}

const RoleContext = createContext<RoleContextType>({
  role: null,
  isLoading: true,
  isAdmin: false,
  isDoctor: false,
  isCashier: false,
  logout: () => {},
});

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadRole = () => {
    const r = getRoleFromToken() as Role;
    setRole(r);
    setIsLoading(false);
  };

  useEffect(() => {
    // Baca role pertama kali
    loadRole();

    // Reactive saat token berubah (misal: logout di tab lain)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "access_token") loadRole();
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const logout = () => {
    clearToken();
    setRole(null);
    router.push("/login");
  };

  return (
    <RoleContext.Provider value={{
      role,
      isLoading,
      isAdmin: role === "admin",
      isDoctor: role === "doctor",
      isCashier: role === "cashier",
      logout,
    }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
