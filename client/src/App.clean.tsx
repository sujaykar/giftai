import { useState, useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { Navbar } from "./components/Navbar";
import HowItWorks from "./pages/how-it-works";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [location, setLocation] = useLocation();
  
  // Sync active tab with location path
  useEffect(() => {
    if (location === "/") {
      // No need to change activeTab as it will be handled by the tab buttons
    } else if (location === "/relationship-gifts") {
      // Just update the UI to show the correct active tab
      setActiveTab("");
    } else if (location === "/how-it-works") {
      // Update for How It Works page
      setActiveTab("");
    }
  }, [location]);

  const [showBudgetTracker, setShowBudgetTracker] = useState(false);
  
  // Handle logout
  const handleLogout = () => {
    setLoggedIn(false);
  };

  return (
    <>
      {!loggedIn ? (
        <Switch>
          <Route path="/how-it-works">
            <HowItWorks />
          </Route>
          <Route>
            {/* Landing page */}
            <div className="min-h-screen bg-white">
              {/* Navigation */}
              <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between h-16">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-indigo-600">GIFT AI</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => setLocation("/how-it-works")}
                        className="text-gray-600 hover:text-indigo-600"
                      >
                        How It Works
                      </button>
                      <button 
                        onClick={() => setLoggedIn(true)}
                        className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        Sign In
                      </button>
                    </div>
                  </div>
                </div>
              </nav>

              {/* Hero section */}
              <div className="pt-16 pb-24 sm:pt-24 sm:pb-32 bg-gradient-to-b from-indigo-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="lg:grid lg:grid-cols-2 lg:gap-12">
                    <div className="lg:self-center">
                      <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Find the Perfect Gift <span className="text-indigo-600">Every Time</span>
                      </h1>
                      <p className="mt-6 text-xl text-gray-600">
                        GIFT AI helps you discover thoughtful, personalized gifts for everyone in your life using advanced AI technology.
                      </p>
                      <div className="mt-10 flex gap-4">
                        <button 
                          onClick={() => setLoggedIn(true)}
                          className="px-6 py-3 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                        >
                          Get Started
                        </button>
                        <button 
                          onClick={() => setLocation("/how-it-works")}
                          className="px-6 py-3 rounded-md bg-white text-indigo-600 font-medium border border-indigo-600 hover:bg-indigo-50"
                        >
                          Learn More
                        </button>
                      </div>
                    </div>
                    <div className="mt-12 lg:mt-0 lg:ml-auto flex justify-center">
                      <img 
                        src="https://www.transparentpng.com/thumb/gift/red-with-bow-gift-png-2.png" 
                        alt="Gift" 
                        className="max-h-96 object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer className="bg-gray-800 text-gray-300 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm">© 2025 GIFT AI. All rights reserved.</p>
                  </div>
                </div>
              </footer>
            </div>
          </Route>
        </Switch>
      ) : (
        <div>
          <Navbar 
            activeTab={activeTab}
            showBudgetTracker={showBudgetTracker}
            location={location}
            setActiveTab={setActiveTab}
            setShowBudgetTracker={setShowBudgetTracker}
            setLocation={setLocation}
            handleLogout={handleLogout}
          />
          
          {/* Main dashboard content */}
          <div className="bg-gray-50 min-h-screen pt-4">
            <div className="container mx-auto px-4">
              <div className="mt-4 bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to GIFT AI</h2>
                <p className="text-gray-600 mb-4">Your personalized gift recommendation platform is ready to help you find the perfect gifts for everyone in your life.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;