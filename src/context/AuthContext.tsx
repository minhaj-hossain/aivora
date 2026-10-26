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

  const onLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("aivora_jwt_token");
    localStorage.removeItem("aivora_user");
  };

  const onAuthSuccess = (newToken: string, newUser: IUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("aivora_jwt_token", newToken);
    localStorage.setItem("aivora_user", JSON.stringify(newUser));
  };

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("aivora_jwt_token");
      const savedUserStr = localStorage.getItem("aivora_user");

      if (savedToken && savedUserStr) {
        const parsedUser = JSON.parse(savedUserStr);
        setToken(savedToken);
        setUser(parsedUser);

        // Verify token validity with backend to clear expired sessions
        fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${savedToken}` },
        })
          .then(async (res) => {
            if (res.ok) {
              const freshUser = await res.json();
              const merged = { ...parsedUser, ...freshUser };
              setUser(merged);
              localStorage.setItem("aivora_user", JSON.stringify(merged));
            } else if (res.status === 401 || res.status === 403) {
              console.warn("Session token expired or invalidated. Signing out.");
              onLogout();
            }
          })
          .catch((err) => {
            console.warn("Network error during session verification:", err);
          });
      }
    } catch (err) {
      console.warn("Failed to restore session from storage:", err);
    } finally {
      setIsLoading(false);
    }

    const handleUnauthorized = () => {
      onLogout();
    };
    window.addEventListener("aivora:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("aivora:unauthorized", handleUnauthorized);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, onAuthSuccess, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function notifyUnauthorized() {
  window.dispatchEvent(new CustomEvent("aivora:unauthorized"));
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
