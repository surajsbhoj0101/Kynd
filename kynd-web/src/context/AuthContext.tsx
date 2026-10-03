"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type PropsWithChildren,
} from "react";
import { apiFetch } from "../lib/api-client.ts";

export enum AccountStatus {
  PENDING = "PENDING",
  ONBOARDING = "ONBOARDING",
  ACTIVE = "ACTIVE",
}

export type User = {
  id: string;
  name: string;
  email: string;
  status: AccountStatus;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  fetchUser: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser(): Promise<User | null> {
    try {
      const response = await apiFetch(
        `${import.meta.env.VITE_BASE_URL}/api/auth/me`,
      );

      if (!response.ok) {
        setUser(null);
        return null;
      }

      const data = await response.json();
      const currentUser = data.data.user as User;
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await apiFetch(`${import.meta.env.VITE_BASE_URL}/api/auth/logout`, {
        method: "POST",
      });
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        logout,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
