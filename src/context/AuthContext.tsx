import React, { createContext, useContext, useState, useEffect } from "react";
import { IUser } from "../types";

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  onAuthSuccess: (token: string, user: IUser) => void;
  onLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("aivora_jwt_token");
      const savedUserStr = localStorage.getItem("aivora_user");
      
      if (savedToken && savedUserStr) {
        setToken(savedToken);
        setUser(JSON.parse(savedUserStr));
      }
    } catch (err) {
      console.warn("Failed to restore session from storage:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onAuthSuccess = (newToken: string, newUser: IUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("aivora_jwt_token", newToken);
    localStorage.setItem("aivora_user", JSON.stringify(newUser));
  };

  const onLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("aivora_jwt_token");
    localStorage.removeItem("aivora_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, onAuthSuccess, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
