import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  LayoutDashboard, 
  Tag, 
  Sparkles, 
  Menu, 
  ChevronLeft, 
  LogOut, 
  User,
  Settings
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
  };
  
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Product Tags', path: '/product-tags', icon: <Tag size={20} /> },
    { name: 'Auto Tagging', path: '/auto-tagging', icon: <Sparkles size={20} /> },
  ];
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white transition-all duration-300 shadow-lg flex flex-col ${expanded ? 'w-64' : 'w-20'}`}>
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          {expanded && <h1 className="text-xl font-bold text-primary">GIFT AI Admin</h1>}
          <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-100">
            {expanded ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.path} className="mb-1">
                <Link
                  to={item.path}
                  className={`flex items-center ${expanded ? 'px-6' : 'justify-center px-2'} py-3 ${
                    location.pathname === item.path ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {expanded && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Footer */}
        <div className="border-t py-4">
          {user && (
            <div className={`flex items-center ${expanded ? 'px-6' : 'justify-center px-2'} mb-4`}>
              <div className="flex-shrink-0">
                <User size={20} className="text-gray-500" />
              </div>
              {expanded && (
                <div className="ml-3">
                  <p className="text-sm font-medium">{`${user.firstName} ${user.lastName}`}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              )}
            </div>
          )}
          
          <div className="flex flex-col">
            <Link
              to="/settings"
              className={`flex items-center ${expanded ? 'px-6' : 'justify-center px-2'} py-3 text-gray-700 hover:bg-gray-100`}
            >
              <Settings size={20} />
              {expanded && <span className="ml-3">Settings</span>}
            </Link>
            
            <button
              onClick={handleLogout}
              className={`flex items-center ${expanded ? 'px-6' : 'justify-center px-2'} py-3 text-gray-700 hover:bg-gray-100`}
            >
              <LogOut size={20} />
              {expanded && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white h-16 border-b flex items-center justify-between px-6">
          <h2 className="text-xl font-medium">
            {navItems.find(item => item.path === location.pathname)?.name || 'Admin Panel'}
          </h2>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;