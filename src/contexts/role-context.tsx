"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

type Role = "admin" | "doctor" | "cashier" | null;

interface RoleContextType {
  role: Role;
  isLoading: boolean;
  isAdmin: boolean;
  isDoctor: boolean;
  isCashier: boolean;
}

const RoleContext = createContext<RoleContextType>({
  role: null,
  isLoading: true,
  isAdmin: false,
  isDoctor: false,
  isCashier: false,
});

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRole = async () => {
      const { data } = await supabase.auth.getSession();
      const r = (data.session?.user?.user_metadata?.role as Role) || null;
      setRole(r);
      setIsLoading(false);
    };
    loadRole();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const r = (session?.user?.user_metadata?.role as Role) || null;
      setRole(r);
      setIsLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <RoleContext.Provider value={{
      role,
      isLoading,
      isAdmin: role === "admin",
      isDoctor: role === "doctor",
      isCashier: role === "cashier",
    }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
