import { useState, useCallback } from 'react'
import axios from 'axios'

// Define user type
export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
}

// Define auth hook
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check authentication status
  const checkAuth = useCallback(async () => {
    try {
      const response = await axios.get('/api/admin/auth/me', {
        withCredentials: true
      })
      
      if (response.data?.user) {
        setUser(response.data.user)
        setIsAuthenticated(true)
        return true
      } else {
        setUser(null)
        setIsAuthenticated(false)
        return false
      }
    } catch (err) {
      setUser(null)
      setIsAuthenticated(false)
      return false
    }
  }, [])

  // Log in
  const login = async (email: string, password: string) => {
    try {
      setError(null)
      const response = await axios.post('/api/admin/auth/login', {
        email,
        password
      }, {
        withCredentials: true
      })
      
      if (response.data?.user) {
        setUser(response.data.user)
        setIsAuthenticated(true)
        return true
      } else {
        setError('Invalid login credentials')
        return false
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed')
      return false
    }
  }

  // Log out
  const logout = async () => {
    try {
      await axios.post('/api/admin/auth/logout', {}, {
        withCredentials: true
      })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  return {
    user,
    isAuthenticated,
    error,
    login,
    logout,
    checkAuth
  }
}