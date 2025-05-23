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
                
                {/* Recent Recipients */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Recipients</h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 p-4">
                      <h3 className="text-lg font-semibold">Emma Thompson</h3>
                      <p className="text-sm text-gray-500">Age: 27</p>
                      <p className="text-sm text-gray-500">Interests: Reading, Hiking, Photography</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4">
                      <h3 className="text-lg font-semibold">Michael Chen</h3>
                      <p className="text-sm text-gray-500">Age: 32</p>
                      <p className="text-sm text-gray-500">Interests: Cooking, Gaming, Travel</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4">
                      <h3 className="text-lg font-semibold">Sarah Johnson</h3>
                      <p className="text-sm text-gray-500">Age: 35</p>
                      <p className="text-sm text-gray-500">Interests: Fitness, Music, Art</p>
                    </div>
                  </div>
                </div>
                
                {/* Upcoming Occasions */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Occasions</h2>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-gray-200 p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Emma Thompson's Birthday</h3>
                        <p className="text-sm text-gray-500">March 15, 2025</p>
                      </div>
                      <div className="bg-pink-100 text-pink-700 text-sm font-medium px-3 py-1 rounded-full">
                        30 days left
                      </div>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Anniversary with Michael</h3>
                        <p className="text-sm text-gray-500">April 10, 2025</p>
                      </div>
                      <div className="bg-pink-100 text-pink-700 text-sm font-medium px-3 py-1 rounded-full">
                        56 days left
                      </div>
                    </div>
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
          
          {/* Rest of landing page content... */}
        </div>
      </Route>
    </Switch>
  );
}

export default App;