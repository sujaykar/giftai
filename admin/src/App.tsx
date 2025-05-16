import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Layout from './components/layout'
import Login from './pages/login'
import Dashboard from './pages/dashboard'
import ProductTags from './pages/product-tags'
import AutoTagging from './pages/auto-tagging'
import { useAuth } from './hooks/useAuth'

// Define auth requirements for routes
type ProtectedRouteProps = {
  children: React.ReactNode
}

function App() {
  const [loading, setLoading] = useState(true)
  const { isAuthenticated, checkAuth } = useAuth()

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth()
      setLoading(false)
    }
    
    initAuth()
  }, [checkAuth])

  // Protected route component
  const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    if (loading) {
      return <div className="flex h-screen w-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />
    }
    
    return <>{children}</>
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/product-tags" element={
          <ProtectedRoute>
            <Layout>
              <ProductTags />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/auto-tagging" element={
          <ProtectedRoute>
            <Layout>
              <AutoTagging />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App