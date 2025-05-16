import React, { createContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: any) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<any | null>(null);
  
  // Check if the user is already authenticated on mount
  const { data, isLoading } = useQuery({
    queryKey: ['/api/auth/current-user'],
    retry: false,
    onError: () => {
      setUser(null);
    }
  });
  
  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);
  
  const login = (userData: any) => {
    setUser(userData);
  };
  
  const logout = () => {
    setUser(null);
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
