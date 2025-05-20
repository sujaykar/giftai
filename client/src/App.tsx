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
                        <a 
                          href="#how-it-works"
                          className="px-6 py-3 rounded-md bg-white text-indigo-600 font-medium border border-indigo-600 hover:bg-indigo-50"
                        >
                          Learn More
                        </a>
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
              
              {/* How It Works Section */}
              <div id="how-it-works" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">How GIFT AI Works</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                      Our intelligent platform makes gift-giving easier and more meaningful than ever before.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="bg-indigo-50 rounded-xl p-8 text-center">
                      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Understanding Relationships</h3>
                      <p className="text-gray-600">
                        We analyze relationship dynamics, personal connections, and emotional contexts to understand the meaning behind gift-giving in your specific situation.
                      </p>
                    </div>
                    
                    <div className="bg-indigo-50 rounded-xl p-8 text-center">
                      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Profiling</h3>
                      <p className="text-gray-600">
                        Our detailed preference gathering builds comprehensive recipient profiles that capture interests, style, hobbies, and practical needs.
                      </p>
                    </div>
                    
                    <div className="bg-indigo-50 rounded-xl p-8 text-center">
                      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Intelligent Matching</h3>
                      <p className="text-gray-600">
                        Our hybrid AI recommendation system combines relationship analysis, collaborative filtering, and content-based filtering to find the perfect gifts.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-16 text-center">
                    <button 
                      onClick={() => setLoggedIn(true)}
                      className="px-6 py-3 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                    >
                      Get Started Now
                    </button>
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