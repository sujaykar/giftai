import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Tags, Zap, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      current: location.pathname === '/'
    },
    {
      name: 'Product Tags',
      href: '/product-tags',
      icon: Tags,
      current: location.pathname === '/product-tags'
    },
    {
      name: 'Auto Tagging',
      href: '/auto-tagging',
      icon: Zap,
      current: location.pathname === '/auto-tagging'
    }
  ];
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 bg-white border-r">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-4">
            <h1 className="text-xl font-bold">Gift AI Admin</h1>
          </div>
          
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    item.current
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      item.current ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          {user && (
            <div className="px-3 pt-3 mt-4 border-t">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User className="h-5 w-5" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user.firstName} {user.lastName}</p>
                  <p className="text-xs font-medium text-gray-500">{user.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100"
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="md:hidden bg-white border-b px-4 py-2 flex items-center justify-between">
        <h1 className="text-lg font-bold">Gift AI Admin</h1>
        <div className="flex items-center space-x-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`p-1 rounded-md ${
                item.current ? 'bg-primary text-white' : 'text-gray-500'
              }`}
              aria-label={item.name}
            >
              <item.icon className="h-6 w-6" />
            </Link>
          ))}
        </div>
      </div>
      
      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;