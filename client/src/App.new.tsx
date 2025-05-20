import { useState, useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { Navbar } from "./components/Navbar";
import HowItWorks from "./pages/how-it-works";
import RelationshipGifts from "./pages/relationship-gifts-new";

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
          <Route path="/relationship-gifts">
            <RelationshipGifts />
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
                        onClick={() => setLocation("/relationship-gifts")}
                        className="text-gray-600 hover:text-indigo-600"
                      >
                        Gift Ideas
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

              {/* Features section */}
              <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Why Choose GIFT AI?</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                      Our intelligent platform makes gift-giving easier and more meaningful than ever before.
                    </p>
                  </div>

                  <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {/* Feature 1 */}
                    <div className="bg-indigo-50 rounded-lg p-6">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Recommendations</h3>
                      <p className="text-gray-600">
                        Our AI analyzes relationships, preferences, and occasions to suggest perfect gifts that truly reflect the recipient's personality.
                      </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-indigo-50 rounded-lg p-6">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Never Miss Important Dates</h3>
                      <p className="text-gray-600">
                        Our smart reminders ensure you never forget birthdays, anniversaries, and special occasions with timely notifications.
                      </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-indigo-50 rounded-lg p-6">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Budget Management</h3>
                      <p className="text-gray-600">
                        Set and track gift budgets for different people and occasions, ensuring you stay within your financial comfort zone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA section */}
              <div className="bg-indigo-600 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h2 className="text-3xl font-bold text-white mb-4">Ready to find the perfect gift?</h2>
                  <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
                    Join thousands of users who have discovered the joy of thoughtful gift-giving with GIFT AI.
                  </p>
                  <button 
                    onClick={() => setLoggedIn(true)}
                    className="px-6 py-3 rounded-md bg-white text-indigo-600 font-medium hover:bg-indigo-50"
                  >
                    Sign Up Free
                  </button>
                </div>
              </div>

              {/* Footer */}
              <footer className="bg-gray-800 text-gray-300 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">GIFT AI</h3>
                      <p className="text-gray-400">Making gift-giving meaningful and simple with AI-powered recommendations.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Features</h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="hover:text-white">Gift Recommendations</a></li>
                        <li><a href="#" className="hover:text-white">Occasion Reminders</a></li>
                        <li><a href="#" className="hover:text-white">Budget Tracking</a></li>
                        <li><a href="#" className="hover:text-white">Gift History</a></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Company</h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="hover:text-white">About Us</a></li>
                        <li><a href="#" className="hover:text-white">Blog</a></li>
                        <li><a href="#" className="hover:text-white">Careers</a></li>
                        <li><a href="#" className="hover:text-white">Contact</a></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Legal</h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
                      </ul>
                    </div>
                  </div>
                  <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm">© 2025 GIFT AI. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                      <a href="#" className="hover:text-white">
                        <span className="sr-only">Facebook</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href="#" className="hover:text-white">
                        <span className="sr-only">Instagram</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href="#" className="hover:text-white">
                        <span className="sr-only">Twitter</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                    </div>
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
              {/* Router implementation for authenticated routes would go here */}
              <div className="mt-4 bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to GIFT AI</h2>
                <p className="text-gray-600 mb-4">Your personalized gift recommendation platform is ready to help you find the perfect gifts for everyone in your life.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-indigo-50 rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Add Recipients</h3>
                    <p className="text-gray-600 text-sm">Create profiles for friends and family to get personalized gift suggestions.</p>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Track Occasions</h3>
                    <p className="text-gray-600 text-sm">Never miss an important date with our smart reminder system.</p>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Get Recommendations</h3>
                    <p className="text-gray-600 text-sm">Discover thoughtful gifts tailored to each person's preferences and interests.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;