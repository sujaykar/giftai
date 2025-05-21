import { Sparkles } from "lucide-react";
import { useLocation } from "wouter";

interface HeaderProps {
  onLogout: () => void;
}

export function Header({ onLogout }: HeaderProps) {
  const [location, navigate] = useLocation();
  
  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-pink-500" />
          <span className="text-2xl font-bold text-pink-500">GIFT AI</span>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className={`px-2 py-1 font-medium ${isActive("/dashboard") ? "text-pink-500 border-b-2 border-pink-500" : "text-gray-600 hover:text-pink-500"}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/recipients")}
              className={`px-2 py-1 font-medium ${isActive("/recipients") ? "text-pink-500 border-b-2 border-pink-500" : "text-gray-600 hover:text-pink-500"}`}
            >
              Recipients
            </button>
            <button
              onClick={() => navigate("/recommendations")}
              className={`px-2 py-1 font-medium ${isActive("/recommendations") ? "text-pink-500 border-b-2 border-pink-500" : "text-gray-600 hover:text-pink-500"}`}
            >
              Recommendations
            </button>
            <button
              onClick={() => navigate("/budget-tracker")}
              className={`px-2 py-1 font-medium ${isActive("/budget-tracker") ? "text-pink-500 border-b-2 border-pink-500" : "text-gray-600 hover:text-pink-500"}`}
            >
              Budget Tracker
            </button>
          </nav>
          
          <button 
            onClick={onLogout}
            className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}