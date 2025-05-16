import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Database, 
  Tag, 
  Home, 
  LogOut, 
  Package, 
  Settings, 
  Zap 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout.mutateAsync();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden w-64 md:flex flex-col bg-white border-r">
        <div className="p-4 h-16 flex items-center border-b">
          <h1 className="text-xl font-bold text-blue-600">GIFT AI Admin</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            <Link
              to="/"
              className={`flex items-center px-4 py-2 text-sm rounded-md ${
                pathname === '/' 
                  ? 'bg-blue-50 text-blue-700 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="mr-3 h-4 w-4" />
              Dashboard
            </Link>

            <Link
              to="/product-tags"
              className={`flex items-center px-4 py-2 text-sm rounded-md ${
                pathname === '/product-tags' 
                  ? 'bg-blue-50 text-blue-700 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Tag className="mr-3 h-4 w-4" />
              Product Tags
            </Link>

            <Link
              to="/auto-tagging"
              className={`flex items-center px-4 py-2 text-sm rounded-md ${
                pathname === '/auto-tagging' 
                  ? 'bg-blue-50 text-blue-700 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Zap className="mr-3 h-4 w-4" />
              Auto Tagging
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
              {user?.firstName?.charAt(0) || 'A'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 md:h-16 border-b bg-white flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center md:hidden">
            <h1 className="text-xl font-bold text-blue-600">GIFT AI Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">{user?.email}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;