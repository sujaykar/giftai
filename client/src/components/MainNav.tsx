import { Sparkles } from "lucide-react";
import { Link } from "wouter";

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
          <Link href="/dashboard">
            <a className={`px-1 py-2 font-medium ${activeTab === "dashboard" ? "text-pink-500" : "text-gray-600 hover:text-pink-500"}`}>
              Dashboard
            </a>
          </Link>
          <Link href="/recipients">
            <a className={`px-1 py-2 font-medium ${activeTab === "recipients" ? "text-pink-500" : "text-gray-600 hover:text-pink-500"}`}>
              Recipients
            </a>
          </Link>
          <Link href="/recommendations">
            <a className={`px-1 py-2 font-medium ${activeTab === "recommendations" ? "text-pink-500" : "text-gray-600 hover:text-pink-500"}`}>
              Recommendations
            </a>
          </Link>
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
          <Link href="/dashboard">
            <a className={`px-1 py-2 font-medium ${activeTab === "dashboard" ? "text-pink-500" : "text-gray-600 hover:text-pink-500"}`}>
              Dashboard
            </a>
          </Link>
          <Link href="/budget-tracker">
            <a className={`px-1 py-2 font-medium ${activeTab === "budget-tracker" ? "text-pink-500" : "text-gray-600 hover:text-pink-500"}`}>
              Budget Tracker
            </a>
          </Link>
          <Link href="/recipients">
            <a className={`px-1 py-2 font-medium ${activeTab === "recipients" ? "text-pink-500" : "text-gray-600 hover:text-pink-500"}`}>
              Recipients
            </a>
          </Link>
          <Link href="/recommendations">
            <a className={`px-1 py-2 font-medium ${activeTab === "recommendations" ? "text-pink-500" : "text-gray-600 hover:text-pink-500"}`}>
              Recommendations
            </a>
          </Link>
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