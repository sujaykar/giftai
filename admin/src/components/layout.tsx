import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Database, Tag, Zap, LogOut, BarChart } from 'lucide-react'
import { useState } from 'react'

// Navigation items
const navItems = [
  { title: 'Dashboard', icon: BarChart, path: '/' },
  { title: 'Product Tags', icon: Tag, path: '/product-tags' },
  { title: 'Auto-Tagging', icon: Zap, path: '/auto-tagging' }
]

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for desktop */}
      <aside className="hidden w-64 border-r border-border bg-card md:block">
        <div className="p-6">
          <h1 className="text-xl font-bold gradient-text">GIFT AI Admin</h1>
        </div>
        
        <nav className="mt-6 flex flex-col space-y-1 px-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.title}
              </Link>
            )
          })}
        </nav>
        
        <div className="mt-auto p-4">
          {user && (
            <div className="mb-4 rounded-lg bg-card-gradient p-4">
              <p className="text-sm font-medium text-foreground">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          )}
          
          <button
            onClick={() => logout()}
            className="flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border px-6 md:hidden">
          <h1 className="text-xl font-bold gradient-text">GIFT AI Admin</h1>
          
          <button
            onClick={toggleMobileMenu}
            className="rounded-md p-2 text-foreground hover:bg-muted"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </header>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-b border-border bg-card md:hidden">
            <nav className="flex flex-col space-y-1 p-4">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.title}
                  </Link>
                )
              })}
              
              <button
                onClick={() => {
                  logout()
                  setMobileMenuOpen(false)
                }}
                className="flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </nav>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout