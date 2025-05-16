import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
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

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component that wraps your app and provides the auth context
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if the user is logged in when the app loads
  useEffect(() => {
    checkAuth().finally(() => setIsLoading(false));
  }, []);

  // Function to check if the user is authenticated
  const checkAuth = async (): Promise<boolean> => {
    try {
      // For demo purposes, we're checking local storage
      // In a real implementation, this would validate the session with the server
      const storedUser = localStorage.getItem('adminUser');
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      
      // For demo purposes, we're hardcoding a mock login
      // In a real implementation, this would validate credentials with the API
      if (email === 'admin@example.com' && password === 'password123') {
        const mockUser = {
          id: 1,
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@example.com',
          role: 'admin'
        };
        
        setUser(mockUser);
        localStorage.setItem('adminUser', JSON.stringify(mockUser));
        return true;
      } else {
        setError('Invalid email or password');
        return false;
      }
      
      // Real implementation would look like:
      // const response = await axios.post('/api/admin/login', { email, password });
      // setUser(response.data.user);
      // localStorage.setItem('token', response.data.token);
      // localStorage.setItem('adminUser', JSON.stringify(response.data.user));
      // return true;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      // For demo purposes, we're just removing from local storage
      // In a real implementation, this would call the API to invalidate the session
      localStorage.removeItem('adminUser');
      setUser(null);
      
      // Real implementation would also do:
      // await axios.post('/api/admin/logout');
      // localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Context value
  const value = {
    user,
    isAuthenticated: !!user,
    error,
    login,
    logout,
    checkAuth
  };

  // Return the auth context provider
  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

// Hook for components to get the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}