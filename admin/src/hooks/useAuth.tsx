import { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import axios from 'axios';

// Types
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      const response = await axios.post('/api/admin/auth/login', { email, password });
      setUser(response.data.user);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await axios.post('/api/admin/auth/logout');
      setUser(null);
    } catch (err) {
      console.error('Logout failed', err);
    }
  }, []);

  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      const response = await axios.get('/api/admin/auth/user');
      if (response.data) {
        setUser(response.data);
        return true;
      }
      return false;
    } catch (err) {
      setUser(null);
      return false;
    }
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    error,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for easy context use
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth;