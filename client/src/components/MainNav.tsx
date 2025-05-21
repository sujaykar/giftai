import { Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";

interface MainNavProps {
  activeTab: string;
  onLogout: () => void;
}

export function MainNav({ activeTab, onLogout }: MainNavProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-pink-500" />
          <span className="text-2xl font-bold text-pink-500">GIFT AI</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <NavLink href="/dashboard" active={activeTab === "dashboard"}>
            Dashboard
          </NavLink>
          <NavLink href="/recipients" active={activeTab === "recipients"}>
            Recipients
          </NavLink>
          <NavLink href="/recommendations" active={activeTab === "recommendations"}>
            Recommendations
          </NavLink>
        </nav>
        
        <button 
          onClick={onLogout}
          className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}

export function FullNav({ activeTab, onLogout }: MainNavProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-pink-500" />
          <span className="text-2xl font-bold text-pink-500">GIFT AI</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <NavLink href="/dashboard" active={activeTab === "dashboard"}>
            Dashboard
          </NavLink>
          <NavLink href="/budget-tracker" active={activeTab === "budget-tracker"}>
            Budget Tracker
          </NavLink>
          <NavLink href="/recipients" active={activeTab === "recipients"}>
            Recipients
          </NavLink>
          <NavLink href="/recommendations" active={activeTab === "recommendations"}>
            Recommendations
          </NavLink>
        </nav>
        
        <button 
          onClick={onLogout}
          className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  const [, navigate] = useLocation();
  
  return (
    <button
      onClick={() => navigate(href)}
      className={`px-1 py-2 font-medium ${active ? "text-pink-500" : "text-gray-600 hover:text-pink-500"}`}
    >
      {children}
    </button>
  );
}