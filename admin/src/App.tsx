import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Pages
import Dashboard from './pages/dashboard';
import Login from './pages/login';
import ProductTags from './pages/product-tags';
import AutoTagging from './pages/auto-tagging';

// Components
import Layout from './components/layout';

// Auth context
import { AuthProvider, useAuth } from './hooks/useAuth';

// Interface for protected routes
type ProtectedRouteProps = {
  children: React.ReactNode
}

function App() {
  // Protected route component
  const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, loading } = useAuth();
    
    if (loading) {
      return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }
    
    if (!user) {
      return <Navigate to="/admin/login" />;
    }
    
    return <>{children}</>;
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          
          <Route path="/admin" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/product-tags" element={
            <ProtectedRoute>
              <Layout>
                <ProductTags />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/auto-tagging" element={
            <ProtectedRoute>
              <Layout>
                <AutoTagging />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Redirect root to admin dashboard */}
          <Route path="/admin/*" element={<Navigate to="/admin" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;