import { Sparkles } from "lucide-react";

interface SimpleNavProps {
  onLogout: () => void;
  onTabChange: (tab: string) => void;
  onBudgetToggle: (show: boolean) => void;
  activeTab: string;
  showBudget: boolean;
}

export function SimpleNav({ onLogout, onTabChange, onBudgetToggle, activeTab, showBudget }: SimpleNavProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-pink-500" />
          <span className="text-2xl font-bold text-pink-500">GIFT AI</span>
        </div>
        
        <nav className="hidden md:block">
          <ul className="flex gap-6">
            <li>
              <button 
                onClick={() => {
                  onTabChange("dashboard");
                  onBudgetToggle(false);
                }} 
                className={`px-1 py-2 font-medium ${activeTab === "dashboard" && !showBudget ? "text-pink-500" : "text-gray-600 hover:text-pink-500"}`}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  onTabChange("dashboard");
                  onBudgetToggle(true);
                }} 
                className={`px-1 py-2 font-medium ${activeTab === "dashboard" && showBudget ? "text-pink-500" : "text-gray-600 hover:text-pink-500"}`}
              >
                Budget Tracker
              </button>
            </li>
            <li>
              <button 
                onClick={() => onTabChange("recipients")} 
                className={`px-1 py-2 font-medium ${activeTab === "recipients" ? "text-pink-500" : "text-gray-600 hover:text-pink-500"}`}
              >
                Recipients
              </button>
            </li>
            <li>
              <button 
                onClick={() => onTabChange("recommendations")} 
                className={`px-1 py-2 font-medium ${activeTab === "recommendations" ? "text-pink-500" : "text-gray-600 hover:text-pink-500"}`}
              >
                Recommendations
              </button>
            </li>
            <li>
              <button 
                onClick={() => onTabChange("relationship")} 
                className={`px-1 py-2 font-medium ${activeTab === "relationship" ? "text-pink-500" : "text-gray-600 hover:text-pink-500"}`}
              >
                Relationship Gifts
              </button>
            </li>
          </ul>
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