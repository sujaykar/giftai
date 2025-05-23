import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { Route, Switch, useLocation } from "wouter";
import { Header } from "./components/Header";
import { RecipientQuiz } from "./components/RecipientQuiz";
import { RecipientsPage } from "./pages/RecipientsPage";
import LearningDemoPage from "./pages/learning-demo";
import DashboardPage from "./pages/dashboard";
import RecommendationsPage from "./pages/recommendations";
import HowItWorksPage from "./pages/how-it-works";

function App() {
  const [loggedIn, setLoggedIn] = useState(true); // Set to true for development
  const [location, setLocation] = useLocation();
  const [showLoginForm, setShowLoginForm] = useState(false);

  // Basic handlers
  const handleLogin = () => {
    setLoggedIn(true);
    setLocation("/dashboard");
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setShowLoginForm(false);
    setLocation("/");
  };

  // Redirect to dashboard if logged in and at root
  useEffect(() => {
    if (loggedIn && location === "/") {
      setLocation("/dashboard");
    }
  }, [loggedIn, location, setLocation]);

  // Authentication state - logged in
  if (loggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onLogout={handleLogout} />
        
        <div className="container mx-auto p-6">
          <Switch>
            <Route path="/dashboard">
              <div className="space-y-8">
                <h1 className="text-3xl font-bold text-gray-900">Welcome, Alex!</h1>
                
                {/* Dashboard summary cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="text-5xl font-bold text-pink-500 mb-2">3</h3>
                    <p className="text-gray-600">Recipients</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="text-5xl font-bold text-pink-500 mb-2">12</h3>
                    <p className="text-gray-600">Recommendations</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="text-5xl font-bold text-pink-500 mb-2">2</h3>
                    <p className="text-gray-600">Upcoming Occasions</p>
                  </div>
                </div>
              </div>
            </Route>
            
            <Route path="/recipients">
              <RecipientsPage />
            </Route>
            
            <Route path="/recommendations">
              <RecommendationsPage />
            </Route>
            
            <Route path="/learning-demo">
              <LearningDemoPage />
            </Route>
          </Switch>
        </div>
      </div>
    );
  }

  // For non-logged in users (new user onboarding experience)
  return (
    <Switch>
      {/* Standalone How It Works page for new user onboarding */}
      <Route path="/how-it-works">
        <HowItWorksPage />
      </Route>
      
      {/* Landing page for everyone else */}
      <Route path="/">
        <div>
          <header className="bg-white border-b border-gray-200">
            <div className="container mx-auto flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-pink-500" />
                <span className="text-2xl font-bold text-pink-500">GIFT AI</span>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setLocation("/how-it-works")}
                  className="text-gray-600 hover:text-pink-500 font-medium transition-colors"
                >
                  How It Works
                </button>
                <button 
                  onClick={() => setShowLoginForm(true)} 
                  className="rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600"
                >
                  Sign In
                </button>
              </div>
            </div>
          </header>
          
          {/* Hero section */}
          <section className="bg-gradient-to-r from-pink-50 to-indigo-50 py-20">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
                  Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-500">Perfect Gift</span> for Everyone
                </h1>
                <p className="mb-8 text-xl text-gray-600 md:text-2xl">
                  Our AI learns about your loved ones and recommends thoughtful gifts that show you truly care.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => setShowLoginForm(true)}
                    className="rounded-lg bg-pink-500 px-8 py-4 text-lg font-medium text-white hover:bg-pink-600 transition-colors"
                  >
                    Get Started Free
                  </button>
                  <button 
                    onClick={() => setLocation("/how-it-works")}
                    className="rounded-lg border border-gray-300 px-8 py-4 text-lg font-medium text-gray-700 hover:border-pink-300 hover:text-pink-600 transition-colors"
                  >
                    How It Works
                  </button>
                </div>
              </div>
            </div>
          </section>
          
          {/* Login/Register Form Modal */}
          {showLoginForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome to GIFT AI</h2>
                
                {/* Google Sign-In Button */}
                <button
                  onClick={handleLogin}
                  className="w-full bg-white border border-gray-300 rounded-md py-3 px-4 flex items-center justify-center gap-3 font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-4"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                {/* Divider */}
                <div className="flex items-center my-6">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-4 text-sm text-gray-500">or</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Email/Password Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Enter your password"
                    />
                  </div>
                  
                  {/* Sign In / Sign Up Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleLogin}
                      className="w-full bg-pink-500 text-white rounded-md py-2 font-medium hover:bg-pink-600 transition-colors"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={handleLogin}
                      className="w-full border border-pink-500 text-pink-500 rounded-md py-2 font-medium hover:bg-pink-50 transition-colors"
                    >
                      Create New Account
                    </button>
                  </div>

                  {/* Additional Options */}
                  <div className="text-center space-y-2">
                    <a href="#" className="text-sm text-pink-500 hover:text-pink-600">
                      Forgot your password?
                    </a>
                  </div>

                  <button
                    onClick={() => setShowLoginForm(false)}
                    className="w-full border border-gray-300 text-gray-700 rounded-md py-2 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Features Section */}
          <section className="bg-white py-20">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose GIFT AI?</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Join thousands who've transformed their gift-giving experience
                </p>
              </div>
              
              <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⏰</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Save Time</h3>
                  <p className="text-gray-600">Skip hours of browsing. Get perfect suggestions in minutes.</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Perfect Matches</h3>
                  <p className="text-gray-600">AI-powered recommendations that truly match their personality.</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💝</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Thoughtful Gifts</h3>
                  <p className="text-gray-600">Show you care with gifts that demonstrate real understanding.</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-pink-500 to-indigo-500 py-16">
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Gift-Giving?
              </h2>
              <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied users who never worry about finding the perfect gift again.
              </p>
              <button 
                onClick={() => setShowLoginForm(true)}
                className="bg-white text-pink-500 hover:bg-gray-50 text-lg px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Get Started Free
              </button>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gray-900 text-white py-8">
            <div className="container mx-auto px-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-pink-400" />
                <span className="text-xl font-bold">GIFT AI</span>
              </div>
              <p className="text-gray-400">© 2025 GIFT AI. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </Route>
    </Switch>
  );
}

export default App;