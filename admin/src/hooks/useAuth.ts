import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export function useAuth() {
  const queryClient = useQueryClient();
  
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['admin-auth-user'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/admin/auth/user');
        return response.data as User;
      } catch (error) {
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const login = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await axios.post('/api/admin/auth/login', credentials);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-auth-user'] });
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/admin/auth/logout');
      return response.data;
    },
    onSuccess: () => {
      queryClient.setQueryData(['admin-auth-user'], null);
      queryClient.invalidateQueries({ queryKey: ['admin-auth-user'] });
    },
  });

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    isAdmin: user?.role === 'admin',
  };
}