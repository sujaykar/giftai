import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

// Define the User type
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

// Define the auth context value type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

// Create the auth context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => ({ success: false }),
  logout: async () => {},
});

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to check if user is logged in
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      // In a real implementation, we would fetch the current user from the API
      // const response = await axios.get('/api/admin/auth/current-user');
      // setUser(response.data);

      // For demo purposes, check localStorage
      const storedUser = localStorage.getItem('adminUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Check auth status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      // In a real implementation, we would call the API for authentication
      // const response = await axios.post('/api/admin/auth/login', { email, password });
      // const userData = response.data;
      // setUser(userData);
      // localStorage.setItem('adminUser', JSON.stringify(userData));

      // For demo purposes, use hardcoded admin credentials
      if (email === 'admin@giftai.com' && password === 'admin123') {
        const mockUser = {
          id: '1',
          email: 'admin@giftai.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
        };
        setUser(mockUser);
        localStorage.setItem('adminUser', JSON.stringify(mockUser));
        return { success: true };
      }
      
      return { success: false, message: 'Invalid email or password' };
    } catch (error: any) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'An error occurred during login' 
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // In a real implementation, we would call the API to logout
      // await axios.post('/api/admin/auth/logout');
      
      // For demo purposes, just remove from localStorage
      localStorage.removeItem('adminUser');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export default useAuth;