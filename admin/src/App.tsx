import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import Login from '@/pages/login'
import Dashboard from '@/pages/dashboard'
import ProductTags from '@/pages/product-tags'
import AutoTagging from '@/pages/auto-tagging'
import { useAuth } from '@/hooks/useAuth'
import Layout from '@/components/layout'

type PrivateRouteProps = {
  children: React.ReactNode
  redirectTo: string
}

const PrivateRoute = ({ children, redirectTo }: PrivateRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to={redirectTo} />
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/" 
          element={
            <PrivateRoute redirectTo="/login">
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/product-tags" 
          element={
            <PrivateRoute redirectTo="/login">
              <Layout>
                <ProductTags />
              </Layout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/auto-tagging" 
          element={
            <PrivateRoute redirectTo="/login">
              <Layout>
                <AutoTagging />
              </Layout>
            </PrivateRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App