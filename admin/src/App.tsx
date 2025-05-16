import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider } from './hooks/useAuth';
import useAuth from './hooks/useAuth';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import ProductTags from './pages/product-tags';
import AutoTagging from './pages/auto-tagging';
import { LayoutShift, Menu, X } from 'lucide-react';

// Layout with sidebar for authenticated pages
const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Sidebar header */}
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <span className="text-lg font-semibold">GIFT AI Admin</span>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 lg:hidden"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* User info */}
          <div className="flex items-center px-4 py-3 border-b">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 font-medium">
                {user.firstName?.charAt(0)}
                {user.lastName?.charAt(0)}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4">
            <div className="space-y-1">
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/product-tags">Product Tags</NavLink>
              <NavLink to="/auto-tagging">AI Auto-Tagging</NavLink>
            </div>

            {/* Logout button at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <button
                onClick={handleLogout}
                className="w-full rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Top navigation */}
        <div className="flex h-16 items-center justify-between border-b bg-white px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Admin Portal</span>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

// Simple navigation link component
const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const isActive = location.pathname === to;
  
  return (
    <a
      href={to}
      className={`block rounded-md px-3 py-2 text-sm font-medium ${
        isActive
          ? 'bg-primary text-white'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {children}
    </a>
  );
};

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/product-tags"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProductTags />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/auto-tagging"
            element={
              <ProtectedRoute>
                <Layout>
                  <AutoTagging />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;