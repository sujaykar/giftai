import { useState } from "react";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<any>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(1);
  const [quizRecipient, setQuizRecipient] = useState({
    name: "",
    age: "",
    relationship: "Friend",
    interests: [] as string[],
    occasions: [] as { type: string; date: string }[],
    budget: { min: 25, max: 100 }
  });
  const [showBudgetTracker, setShowBudgetTracker] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    priceRange: [0, 500],
    categories: [] as string[],
    occasions: [] as string[]
  });

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setShowLoginForm(false);
  };
  
  const handleQuizInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuizRecipient(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleInterestToggle = (interest: string) => {
    setQuizRecipient(prev => {
      const interests = [...prev.interests];
      if (interests.includes(interest)) {
        return {
          ...prev,
          interests: interests.filter(i => i !== interest)
        };
      } else {
        return {
          ...prev,
          interests: [...interests, interest]
        };
      }
    });
  };
  
  const handleOccasionAdd = (type: string, date: string) => {
    setQuizRecipient(prev => ({
      ...prev,
      occasions: [...prev.occasions, { type, date }]
    }));
  };
  
  const handleBudgetChange = (min: number, max: number) => {
    setQuizRecipient(prev => ({
      ...prev,
      budget: { min, max }
    }));
  };
  
  const nextQuizStep = () => {
    setQuizStep(prev => prev + 1);
  };
  
  const prevQuizStep = () => {
    setQuizStep(prev => Math.max(1, prev - 1));
  };
  
  const finishQuiz = () => {
    // Here you would typically save the recipient to your database
    // For now we'll just close the quiz
    setShowQuiz(false);
    setQuizStep(1);
    // Reset the form
    setQuizRecipient({
      name: "",
      age: "",
      relationship: "Friend",
      interests: [],
      occasions: [],
      budget: { min: 25, max: 100 }
    });
  };

  if (!loggedIn) {
    if (showLoginForm) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
          <div className="w-full max-w-md space-y-6 rounded-lg border border-gray-200 bg-white p-8 shadow-lg">
            <div className="space-y-2 text-center">
              <h1 className="text-4xl font-bold text-pink-500">GIFT AI</h1>
              <p className="text-gray-600">Sign in to your account</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  placeholder="you@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <button 
              onClick={handleLogin}
              className="w-full rounded-md bg-pink-500 px-4 py-3 text-sm font-medium text-white shadow hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              Sign In (Demo Mode)
            </button>
            
            <div className="text-center text-sm">
              <p className="text-gray-500">
                New to GIFT AI? <span onClick={() => setShowLoginForm(false)} className="cursor-pointer text-pink-500 hover:underline">Return to home</span>
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    // Landing page
    return (
      <div className="bg-white">
        {/* Hero section */}
        <header className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-indigo-50 z-0"></div>
          
          <nav className="relative z-10 container mx-auto flex items-center justify-between p-6">
            <div className="flex items-center">
              <span className="text-3xl font-bold text-pink-500">GIFT AI</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowLoginForm(true)}
                className="px-4 py-2 text-sm font-medium text-pink-600 hover:text-pink-700"
              >
                Sign In
              </button>
              <button 
                onClick={() => setShowLoginForm(true)}
                className="rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600"
              >
                Get Started
              </button>
            </div>
          </nav>
          
          <div className="relative z-10 container mx-auto px-6 pt-20 pb-24 md:pb-32 md:pt-32">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl">
                Never Struggle With Gift-Giving <span className="text-pink-500">Again</span>
              </h1>
              <p className="mb-10 mx-auto max-w-2xl text-xl text-gray-600">
                GIFT AI uses intelligent algorithms to suggest personalized gifts for your friends and family based on their interests, preferences, and special occasions.
              </p>
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <button 
                  onClick={() => setShowLoginForm(true)}
                  className="rounded-md bg-pink-500 px-8 py-3 text-base font-medium text-white shadow-md hover:bg-pink-600"
                >
                  Start Finding Perfect Gifts
                </button>
                <button className="rounded-md bg-white px-8 py-3 text-base font-medium text-pink-600 shadow-md hover:bg-gray-50">
                  How It Works
                </button>
              </div>
            </div>
          </div>
          
          <div className="relative z-0 mx-auto max-w-6xl">
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 transform rounded-xl bg-white p-2 shadow-2xl">
              <div className="overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80" 
                  alt="Gift box with bow" 
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>
        
        {/* Features section */}
        <section className="bg-white py-32 mt-24">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">How GIFT AI Works</h2>
              <p className="mb-12 text-gray-600">Our intelligent platform makes finding the perfect gift as easy as answering a few questions.</p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-pink-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Add Your Recipients</h3>
                <p className="text-gray-600">Create profiles for friends and family members you want to find gifts for.</p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-pink-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Tell Us About Them</h3>
                <p className="text-gray-600">Answer questions about their interests, hobbies, and preferences.</p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-pink-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Get Recommendations</h3>
                <p className="text-gray-600">Our AI generates personalized gift suggestions based on their profile.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-gray-900">What Our Users Say</h2>
              <p className="mb-12 text-gray-600">Join thousands of satisfied users who have found the perfect gifts.</p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow">
                <div className="mb-4 text-pink-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-8 w-8" viewBox="0 0 975.036 975.036">
                    <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
                  </svg>
                </div>
                <p className="mb-4 text-gray-600">GIFT AI helped me find the perfect birthday present for my husband. The suggestions were spot-on with his interests!</p>
                <div className="font-medium">
                  <p className="text-gray-900">Sarah T.</p>
                  <p className="text-sm text-gray-500">New York</p>
                </div>
              </div>
              
              <div className="rounded-lg bg-white p-6 shadow">
                <div className="mb-4 text-pink-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-8 w-8" viewBox="0 0 975.036 975.036">
                    <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
                  </svg>
                </div>
                <p className="mb-4 text-gray-600">This app is a lifesaver for someone like me who struggles with gift ideas. No more generic presents for my friends!</p>
                <div className="font-medium">
                  <p className="text-gray-900">John M.</p>
                  <p className="text-sm text-gray-500">Chicago</p>
                </div>
              </div>
              
              <div className="rounded-lg bg-white p-6 shadow">
                <div className="mb-4 text-pink-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-8 w-8" viewBox="0 0 975.036 975.036">
                    <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
                  </svg>
                </div>
                <p className="mb-4 text-gray-600">I've recommended GIFT AI to all my friends. It's like having a personal shopper who really knows the people in your life.</p>
                <div className="font-medium">
                  <p className="text-gray-900">Lisa K.</p>
                  <p className="text-sm text-gray-500">San Francisco</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="bg-pink-500 py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="mb-6 text-3xl font-bold text-white">Ready to become a gift-giving expert?</h2>
            <p className="mb-8 text-lg text-white/90">Join GIFT AI today and never give another disappointing gift.</p>
            <button 
              onClick={() => setShowLoginForm(true)}
              className="inline-block rounded-md bg-white px-8 py-3 text-base font-medium text-pink-600 shadow-md hover:bg-gray-100"
            >
              Get Started – It's Free
            </button>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="bg-gray-900 py-12 text-gray-300">
          <div className="container mx-auto px-6">
            <div className="grid gap-8 md:grid-cols-4">
              <div>
                <h3 className="mb-4 text-xl font-bold text-white">GIFT AI</h3>
                <p>Personalized gift recommendations powered by artificial intelligence.</p>
              </div>
              <div>
                <h4 className="mb-4 font-medium text-white">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">Features</a></li>
                  <li><a href="#" className="hover:text-white">How It Works</a></li>
                  <li><a href="#" className="hover:text-white">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-medium text-white">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">About</a></li>
                  <li><a href="#" className="hover:text-white">Blog</a></li>
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-medium text-white">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">Terms</a></li>
                  <li><a href="#" className="hover:text-white">Privacy</a></li>
                  <li><a href="#" className="hover:text-white">Cookies</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 border-t border-gray-700 pt-8 text-center">
              <p>© 2025 GIFT AI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Dashboard view after login
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-pink-500">GIFT AI</span>
          </div>
          
          <nav className="hidden md:block">
            <ul className="flex gap-6">
              <li>
                <button 
                  onClick={() => setActiveTab("dashboard")} 
                  className={`px-1 py-2 font-medium ${activeTab === "dashboard" ? "text-pink-500" : "text-gray-600 hover:text-pink-500"}`}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab("recipients")} 
                  className={`px-1 py-2 font-medium ${activeTab === "recipients" ? "text-pink-500" : "text-gray-600 hover:text-pink-500"}`}
                >
                  Recipients
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab("recommendations")} 
                  className={`px-1 py-2 font-medium ${activeTab === "recommendations" ? "text-pink-500" : "text-gray-600 hover:text-pink-500"}`}
                >
                  Recommendations
                </button>
              </li>
            </ul>
          </nav>
          
          <button 
            onClick={handleLogout}
            className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Sign Out
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto p-6">
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Welcome, Alex!</h1>
            
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="text-4xl font-bold text-pink-500">3</div>
                <div className="mt-1 text-gray-600">Recipients</div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="text-4xl font-bold text-pink-500">12</div>
                <div className="mt-1 text-gray-600">Recommendations</div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="text-4xl font-bold text-pink-500">2</div>
                <div className="mt-1 text-gray-600">Upcoming Occasions</div>
              </div>
            </div>
            
            {/* Recent Recipients */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Recent Recipients</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: "Emma Thompson", age: 27, interests: "Reading, Hiking, Photography" },
                  { name: "Michael Chen", age: 32, interests: "Cooking, Gaming, Travel" },
                  { name: "Sarah Johnson", age: 24, interests: "Music, Art, Technology" }
                ].map((recipient, index) => (
                  <div key={index} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-2 text-lg font-medium text-gray-900">{recipient.name}</div>
                    <div className="text-sm text-gray-500">Age: {recipient.age}</div>
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Interests:</span> {recipient.interests}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Upcoming Occasions */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Upcoming Occasions</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-md border border-pink-100 bg-pink-50 p-3">
                  <div>
                    <div className="font-medium text-gray-900">Birthday - Emma Thompson</div>
                    <div className="text-sm text-gray-600">June 15, 2025</div>
                  </div>
                  <div className="rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-600">
                    30 days left
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-md border border-pink-100 bg-pink-50 p-3">
                  <div>
                    <div className="font-medium text-gray-900">Anniversary - Michael Chen</div>
                    <div className="text-sm text-gray-600">July 10, 2025</div>
                  </div>
                  <div className="rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-600">
                    55 days left
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "recipients" && !selectedRecipient && !showQuiz && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Recipients</h1>
              <button 
                onClick={() => setShowQuiz(true)}
                className="rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600"
              >
                Add Recipient
              </button>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { id: 1, name: "Emma Thompson", age: 27, interests: "Reading, Hiking, Photography" },
                { id: 2, name: "Michael Chen", age: 32, interests: "Cooking, Gaming, Travel" },
                { id: 3, name: "Sarah Johnson", age: 24, interests: "Music, Art, Technology" }
              ].map((recipient, index) => (
                <div key={index} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-2 text-xl font-medium text-gray-900">{recipient.name}</div>
                  <div className="text-sm text-gray-500">Age: {recipient.age}</div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Interests:</span> {recipient.interests}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={() => setSelectedRecipient(recipient)}
                      className="rounded-md bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-600"
                    >
                      View Details
                    </button>
                    <button className="rounded-md bg-pink-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-pink-600">
                      Get Recommendations
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === "recipients" && selectedRecipient && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedRecipient(null)} 
                className="flex items-center gap-1 text-indigo-500 hover:text-indigo-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Back to Recipients
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Recipient Details */}
              <div className="md:w-1/3">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-center mb-4">
                    <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-500">
                        {selectedRecipient.name.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedRecipient.name}</h2>
                    <p className="text-gray-500">Age: {selectedRecipient.age}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900">Interests</h3>
                      <p className="text-gray-600">{selectedRecipient.interests}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900">Upcoming Occasions</h3>
                      <div className="mt-2 space-y-2">
                        <div className="rounded border border-gray-200 p-2">
                          <div className="font-medium">Birthday</div>
                          <div className="text-sm text-gray-500">June 15, 2025</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900">Other Preferences</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="inline-flex rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-medium text-pink-800">
                          Books
                        </span>
                        <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          Outdoors
                        </span>
                        <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Photography
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    <button className="w-full rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600">
                      Get New Recommendations
                    </button>
                    <button className="w-full rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Gift History */}
              <div className="md:w-2/3">
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                  <div className="border-b border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900">Gift History</h2>
                    <p className="text-gray-600">Previous gifts given to {selectedRecipient.name}</p>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-6">
                      {selectedRecipient.id === 1 ? (
                        <>
                          <div className="rounded-lg border border-gray-200 p-4">
                            <div className="flex items-start gap-4">
                              <div className="h-14 w-14 flex-shrink-0 rounded bg-gray-100"></div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-medium text-gray-900">Kindle Paperwhite</h3>
                                  <span className="text-sm text-gray-500">Feb 14, 2025</span>
                                </div>
                                <p className="text-sm text-gray-600">Valentine's Day</p>
                                <div className="mt-2 flex items-center">
                                  <span className="mr-2 text-sm text-gray-500">Price:</span>
                                  <span className="font-medium text-pink-600">$139.99</span>
                                </div>
                                <div className="mt-2">
                                  <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                    Well Received
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="rounded-lg border border-gray-200 p-4">
                            <div className="flex items-start gap-4">
                              <div className="h-14 w-14 flex-shrink-0 rounded bg-gray-100"></div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-medium text-gray-900">Hiking Backpack</h3>
                                  <span className="text-sm text-gray-500">Dec 25, 2024</span>
                                </div>
                                <p className="text-sm text-gray-600">Christmas</p>
                                <div className="mt-2 flex items-center">
                                  <span className="mr-2 text-sm text-gray-500">Price:</span>
                                  <span className="font-medium text-pink-600">$89.99</span>
                                </div>
                                <div className="mt-2">
                                  <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                    Well Received
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : selectedRecipient.id === 2 ? (
                        <>
                          <div className="rounded-lg border border-gray-200 p-4">
                            <div className="flex items-start gap-4">
                              <div className="h-14 w-14 flex-shrink-0 rounded bg-gray-100"></div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-medium text-gray-900">Cooking Masterclass Subscription</h3>
                                  <span className="text-sm text-gray-500">Mar 15, 2025</span>
                                </div>
                                <p className="text-sm text-gray-600">Birthday</p>
                                <div className="mt-2 flex items-center">
                                  <span className="mr-2 text-sm text-gray-500">Price:</span>
                                  <span className="font-medium text-pink-600">$79.99</span>
                                </div>
                                <div className="mt-2">
                                  <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                    Loved It
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="rounded-lg border border-gray-200 p-4">
                            <div className="flex items-start gap-4">
                              <div className="h-14 w-14 flex-shrink-0 rounded bg-gray-100"></div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-medium text-gray-900">Nintendo Switch</h3>
                                  <span className="text-sm text-gray-500">Dec 25, 2024</span>
                                </div>
                                <p className="text-sm text-gray-600">Christmas</p>
                                <div className="mt-2 flex items-center">
                                  <span className="mr-2 text-sm text-gray-500">Price:</span>
                                  <span className="font-medium text-pink-600">$299.99</span>
                                </div>
                                <div className="mt-2">
                                  <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                    Loved It
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="rounded-lg border border-gray-200 p-4">
                            <div className="flex items-start gap-4">
                              <div className="h-14 w-14 flex-shrink-0 rounded bg-gray-100"></div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-medium text-gray-900">Wireless Noise-Cancelling Headphones</h3>
                                  <span className="text-sm text-gray-500">Jan 5, 2025</span>
                                </div>
                                <p className="text-sm text-gray-600">Birthday</p>
                                <div className="mt-2 flex items-center">
                                  <span className="mr-2 text-sm text-gray-500">Price:</span>
                                  <span className="font-medium text-pink-600">$249.99</span>
                                </div>
                                <div className="mt-2">
                                  <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                    Well Received
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="rounded-lg border border-gray-200 p-4">
                            <div className="flex items-start gap-4">
                              <div className="h-14 w-14 flex-shrink-0 rounded bg-gray-100"></div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-medium text-gray-900">Art Supplies Set</h3>
                                  <span className="text-sm text-gray-500">Dec 25, 2024</span>
                                </div>
                                <p className="text-sm text-gray-600">Christmas</p>
                                <div className="mt-2 flex items-center">
                                  <span className="mr-2 text-sm text-gray-500">Price:</span>
                                  <span className="font-medium text-pink-600">$65.99</span>
                                </div>
                                <div className="mt-2">
                                  <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                    Loved It
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      
                      <div className="text-center">
                        <button className="text-sm text-indigo-500 hover:text-indigo-600">
                          View All Gift History
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Current Recommendations */}
                <div className="mt-6 rounded-lg border border-gray-200 bg-white shadow-sm">
                  <div className="border-b border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900">Current Recommendations</h2>
                    <p className="text-gray-600">Gift ideas for upcoming occasions</p>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {selectedRecipient.id === 1 ? (
                        <>
                          <div className="rounded-lg border border-gray-200 p-4">
                            <h3 className="font-medium text-gray-900">Travel Journal</h3>
                            <p className="text-sm text-gray-600">Perfect for documenting adventures</p>
                            <div className="mt-2 flex items-center">
                              <span className="mr-2 text-sm text-gray-500">Price:</span>
                              <span className="font-medium text-pink-600">$24.99</span>
                            </div>
                          </div>
                          
                          <div className="rounded-lg border border-gray-200 p-4">
                            <h3 className="font-medium text-gray-900">Photography Class</h3>
                            <p className="text-sm text-gray-600">Online course with professional photographer</p>
                            <div className="mt-2 flex items-center">
                              <span className="mr-2 text-sm text-gray-500">Price:</span>
                              <span className="font-medium text-pink-600">$99.00</span>
                            </div>
                          </div>
                        </>
                      ) : selectedRecipient.id === 2 ? (
                        <>
                          <div className="rounded-lg border border-gray-200 p-4">
                            <h3 className="font-medium text-gray-900">Gourmet Spice Set</h3>
                            <p className="text-sm text-gray-600">Collection of exotic spices</p>
                            <div className="mt-2 flex items-center">
                              <span className="mr-2 text-sm text-gray-500">Price:</span>
                              <span className="font-medium text-pink-600">$49.99</span>
                            </div>
                          </div>
                          
                          <div className="rounded-lg border border-gray-200 p-4">
                            <h3 className="font-medium text-gray-900">Travel Experience Gift Card</h3>
                            <p className="text-sm text-gray-600">Choose from hundreds of destinations</p>
                            <div className="mt-2 flex items-center">
                              <span className="mr-2 text-sm text-gray-500">Price:</span>
                              <span className="font-medium text-pink-600">$150.00</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="rounded-lg border border-gray-200 p-4">
                            <h3 className="font-medium text-gray-900">Concert Tickets</h3>
                            <p className="text-sm text-gray-600">For her favorite band's upcoming show</p>
                            <div className="mt-2 flex items-center">
                              <span className="mr-2 text-sm text-gray-500">Price:</span>
                              <span className="font-medium text-pink-600">$120.00</span>
                            </div>
                          </div>
                          
                          <div className="rounded-lg border border-gray-200 p-4">
                            <h3 className="font-medium text-gray-900">Digital Drawing Tablet</h3>
                            <p className="text-sm text-gray-600">For digital art creation</p>
                            <div className="mt-2 flex items-center">
                              <span className="mr-2 text-sm text-gray-500">Price:</span>
                              <span className="font-medium text-pink-600">$179.99</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Recipient Quiz */}
        {activeTab === "recipients" && showQuiz && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowQuiz(false)} 
                className="flex items-center gap-1 text-indigo-500 hover:text-indigo-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Back to Recipients
              </button>
            </div>
            
            <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Add New Recipient</h2>
                <p className="text-gray-600">Help us understand who you're shopping for</p>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="relative mb-2">
                  <div className="absolute h-1 w-full bg-gray-200 rounded"></div>
                  <div 
                    className="absolute h-1 bg-pink-500 rounded" 
                    style={{ width: `${(quizStep / 4) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between">
                  <span className={`text-xs font-medium ${quizStep >= 1 ? 'text-pink-500' : 'text-gray-500'}`}>Basic Info</span>
                  <span className={`text-xs font-medium ${quizStep >= 2 ? 'text-pink-500' : 'text-gray-500'}`}>Interests</span>
                  <span className={`text-xs font-medium ${quizStep >= 3 ? 'text-pink-500' : 'text-gray-500'}`}>Occasions</span>
                  <span className={`text-xs font-medium ${quizStep >= 4 ? 'text-pink-500' : 'text-gray-500'}`}>Budget</span>
                </div>
              </div>
              
              {/* Step 1: Basic Information */}
              {quizStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Recipient's Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={quizRecipient.name}
                      onChange={handleQuizInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      placeholder="e.g., John Smith"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                      Age
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={quizRecipient.age}
                      onChange={handleQuizInputChange}
                      min="1"
                      max="120"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      placeholder="e.g., 35"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="relationship" className="block text-sm font-medium text-gray-700">
                      Relationship
                    </label>
                    <select
                      id="relationship"
                      name="relationship"
                      value={quizRecipient.relationship}
                      onChange={handleQuizInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    >
                      <option value="Friend">Friend</option>
                      <option value="Family">Family</option>
                      <option value="Spouse/Partner">Spouse/Partner</option>
                      <option value="Colleague">Colleague</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              )}
              
              {/* Step 2: Interests */}
              {quizStep === 2 && (
                <div className="space-y-6">
                  <p className="text-sm text-gray-600">Select all interests that apply to {quizRecipient.name || "your recipient"}</p>
                  
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {[
                      "Reading", "Cooking", "Gardening", "Fitness", "Technology", 
                      "Travel", "Music", "Art", "Fashion", "Sports",
                      "Gaming", "Movies", "Photography", "Outdoors", "Wellness",
                      "Crafts", "Home Decor", "Pets", "Food & Drink", "Science",
                      "Cars", "Beauty", "Collecting", "DIY"
                    ].map((interest) => (
                      <div 
                        key={interest}
                        onClick={() => handleInterestToggle(interest)}
                        className={`cursor-pointer rounded-md border p-3 text-center text-sm transition-colors ${
                          quizRecipient.interests.includes(interest)
                            ? "border-pink-300 bg-pink-50 text-pink-700"
                            : "border-gray-200 hover:border-pink-200 hover:bg-pink-50"
                        }`}
                      >
                        {interest}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Step 3: Occasions */}
              {quizStep === 3 && (
                <div className="space-y-6">
                  <p className="text-sm text-gray-600">Add important occasions for {quizRecipient.name || "your recipient"}</p>
                  
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={() => handleOccasionAdd("Birthday", "2025-06-15")}
                        className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
                      >
                        Birthday
                      </button>
                      <button 
                        onClick={() => handleOccasionAdd("Anniversary", "2025-08-10")}
                        className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
                      >
                        Anniversary
                      </button>
                      <button 
                        onClick={() => handleOccasionAdd("Christmas", "2025-12-25")}
                        className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
                      >
                        Christmas
                      </button>
                      <button 
                        onClick={() => handleOccasionAdd("Valentine's Day", "2026-02-14")}
                        className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
                      >
                        Valentine's Day
                      </button>
                      <button 
                        onClick={() => handleOccasionAdd("Graduation", "2025-05-30")}
                        className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
                      >
                        Graduation
                      </button>
                    </div>
                    
                    {quizRecipient.occasions.length > 0 && (
                      <div className="rounded-md border border-gray-200 p-4">
                        <h3 className="mb-2 font-medium text-gray-900">Added Occasions:</h3>
                        <ul className="space-y-2">
                          {quizRecipient.occasions.map((occasion, index) => (
                            <li key={index} className="flex items-center justify-between">
                              <span>{occasion.type}</span>
                              <span className="text-sm text-gray-500">{occasion.date}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Step 4: Budget */}
              {quizStep === 4 && (
                <div className="space-y-6">
                  <p className="text-sm text-gray-600">What's your budget range for gifts for {quizRecipient.name || "your recipient"}?</p>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">${quizRecipient.budget.min}</span>
                      <span className="text-sm text-gray-600">${quizRecipient.budget.max}</span>
                    </div>
                    
                    <div className="flex space-x-4">
                      <div className="w-1/2">
                        <label htmlFor="minBudget" className="block text-sm font-medium text-gray-700">
                          Minimum ($)
                        </label>
                        <input
                          type="range"
                          id="minBudget"
                          min="0"
                          max={quizRecipient.budget.max - 1}
                          value={quizRecipient.budget.min}
                          onChange={(e) => handleBudgetChange(parseInt(e.target.value), quizRecipient.budget.max)}
                          className="mt-1 w-full"
                        />
                      </div>
                      
                      <div className="w-1/2">
                        <label htmlFor="maxBudget" className="block text-sm font-medium text-gray-700">
                          Maximum ($)
                        </label>
                        <input
                          type="range"
                          id="maxBudget"
                          min={quizRecipient.budget.min + 1}
                          max="1000"
                          value={quizRecipient.budget.max}
                          onChange={(e) => handleBudgetChange(quizRecipient.budget.min, parseInt(e.target.value))}
                          className="mt-1 w-full"
                        />
                      </div>
                    </div>
                    
                    <div className="rounded-md bg-indigo-50 p-4 text-sm text-indigo-700">
                      <p>Budget range: ${quizRecipient.budget.min} - ${quizRecipient.budget.max}</p>
                      <p className="mt-2">We'll use this range to suggest gifts within your budget.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={prevQuizStep}
                  className={`rounded-md px-4 py-2 text-sm font-medium ${
                    quizStep === 1 
                      ? "invisible" 
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                
                {quizStep < 4 ? (
                  <button
                    onClick={nextQuizStep}
                    className="rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={finishQuiz}
                    className="rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600"
                  >
                    Finish & Get Recommendations
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "recommendations" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Recommendations</h1>
              <div className="flex gap-2">
                <select className="rounded-md border border-gray-300 px-3 py-2 text-sm">
                  <option>All Recipients</option>
                  <option>Emma Thompson</option>
                  <option>Michael Chen</option>
                  <option>Sarah Johnson</option>
                </select>
                <button className="rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600">
                  Generate New
                </button>
              </div>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Kindle Paperwhite", price: "$139.99", recipient: "Emma Thompson", category: "Technology" },
                { title: "Cooking Masterclass Subscription", price: "$79.99", recipient: "Michael Chen", category: "Experiences" },
                { title: "Wireless Noise-Cancelling Headphones", price: "$249.99", recipient: "Sarah Johnson", category: "Technology" },
                { title: "Hiking Backpack", price: "$89.99", recipient: "Emma Thompson", category: "Outdoors" },
                { title: "Nintendo Switch", price: "$299.99", recipient: "Michael Chen", category: "Gaming" },
                { title: "Art Supplies Set", price: "$65.99", recipient: "Sarah Johnson", category: "Creativity" }
              ].map((recommendation, index) => (
                <div key={index} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-1 text-lg font-medium text-gray-900">{recommendation.title}</div>
                  <div className="mb-3 text-pink-500 font-medium">{recommendation.price}</div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">For:</span> {recommendation.recipient}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Category:</span> {recommendation.category}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200">
                      View Product
                    </button>
                    <button className="rounded-md bg-green-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-600">
                      Save
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
