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
  const [budgetData, setBudgetData] = useState({
    totalBudget: 1000,
    spent: 437.97,
    budgetsByRecipient: [
      { id: 1, name: "Emma Thompson", budget: 350, spent: 229.98 },
      { id: 2, name: "Michael Chen", budget: 400, spent: 79.99 },
      { id: 3, name: "Sarah Johnson", budget: 250, spent: 128.00 }
    ],
    budgetsByOccasion: [
      { occasion: "Birthday", budget: 450, spent: 139.99 },
      { occasion: "Christmas", budget: 400, spent: 155.98 },
      { occasion: "Valentine's Day", budget: 150, spent: 142.00 }
    ],
    recentPurchases: [
      { id: 1, item: "Kindle Paperwhite", recipient: "Emma Thompson", price: 139.99, date: "2025-03-15", occasion: "Birthday" },
      { id: 2, item: "Hiking Backpack", recipient: "Emma Thompson", price: 89.99, date: "2024-12-25", occasion: "Christmas" },
      { id: 3, item: "Cooking Masterclass", recipient: "Michael Chen", price: 79.99, date: "2025-02-14", occasion: "Valentine's Day" },
      { id: 4, item: "Art Supplies Set", recipient: "Sarah Johnson", price: 65.99, date: "2024-12-25", occasion: "Christmas" },
      { id: 5, item: "Wireless Earbuds", recipient: "Sarah Johnson", price: 62.01, date: "2025-01-20", occasion: "Birthday" }
    ]
  });
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
                <p className="mb-4 text-gray-600">I love how personalized the recommendations are. I've discovered gift ideas I would have never thought of myself!</p>
                <div className="font-medium">
                  <p className="text-gray-900">Maria R.</p>
                  <p className="text-sm text-gray-500">Los Angeles</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA section */}
        <section className="bg-pink-500 py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="mb-6 text-3xl font-bold text-white">Ready to Simplify Gift-Giving?</h2>
            <p className="mb-8 mx-auto max-w-2xl text-lg text-pink-100">Join thousands of users who have made gifting stress-free with our AI-powered recommendations.</p>
            <button 
              onClick={() => setShowLoginForm(true)}
              className="inline-block rounded-md bg-white px-8 py-3 text-base font-medium text-pink-600 shadow-md hover:bg-gray-50"
            >
              Get Started for Free
            </button>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="bg-gray-800 py-12 text-gray-300">
          <div className="container mx-auto px-6">
            <div className="mb-8 text-center">
              <span className="text-2xl font-bold text-white">GIFT AI</span>
              <p className="mt-2 text-sm text-gray-400">The intelligent gift recommendation platform</p>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-white">Company</h3>
                <ul className="space-y-2 text-sm">
                  <li>About Us</li>
                  <li>Careers</li>
                  <li>Press</li>
                </ul>
              </div>
              
              <div>
                <h3 className="mb-4 text-lg font-semibold text-white">Resources</h3>
                <ul className="space-y-2 text-sm">
                  <li>Blog</li>
                  <li>Gift Guides</li>
                  <li>Help Center</li>
                </ul>
              </div>
              
              <div>
                <h3 className="mb-4 text-lg font-semibold text-white">Legal</h3>
                <ul className="space-y-2 text-sm">
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                  <li>Cookie Policy</li>
                </ul>
              </div>
              
              <div>
                <h3 className="mb-4 text-lg font-semibold text-white">Connect</h3>
                <ul className="space-y-2 text-sm">
                  <li>Contact Us</li>
                  <li>support@giftai.example.com</li>
                  <li>1-800-GIFT-AI-1</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 border-t border-gray-700 pt-8 text-center text-sm">
              <p>&copy; {new Date().getFullYear()} GIFT AI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Main app after login
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-pink-500">GIFT AI</span>
          </div>
          
          <nav className="hidden md:block">
            <ul className="flex gap-6">
              <li>
                <button 
                  onClick={() => {
                    setActiveTab("dashboard");
                    setShowBudgetTracker(false);
                  }} 
                  className={`px-1 py-2 font-medium ${activeTab === "dashboard" && !showBudgetTracker ? "text-pink-500" : "text-gray-600 hover:text-pink-500"}`}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setActiveTab("dashboard");
                    setShowBudgetTracker(true);
                  }} 
                  className={`px-1 py-2 font-medium ${activeTab === "dashboard" && showBudgetTracker ? "text-pink-500" : "text-gray-600 hover:text-pink-500"}`}
                >
                  Budget Tracker
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
        {activeTab === "dashboard" && !showBudgetTracker && (
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
                  { name: "Sarah Johnson", age: 35, interests: "Fitness, Music, Art" }
                ].map((recipient, index) => (
                  <div key={index} className="rounded-lg border border-gray-200 p-4">
                    <div className="mb-2 text-lg font-medium text-gray-900">{recipient.name}</div>
                    <div className="text-sm text-gray-600">Age: {recipient.age}</div>
                    <div className="text-sm text-gray-600">Interests: {recipient.interests}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Upcoming Occasions */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Upcoming Occasions</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                  <div>
                    <div className="font-medium text-gray-900">Emma Thompson's Birthday</div>
                    <div className="text-sm text-gray-600">March 15, 2025</div>
                  </div>
                  <div className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-700">
                    30 days left
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                  <div>
                    <div className="font-medium text-gray-900">Michael & Lisa's Anniversary</div>
                    <div className="text-sm text-gray-600">April 10, 2025</div>
                  </div>
                  <div className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-700">
                    56 days left
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Recommendations */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Recommendations</h2>
                <button 
                  onClick={() => setActiveTab("recommendations")}
                  className="text-sm text-pink-500 hover:text-pink-600"
                >
                  View All
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { title: "Kindle Paperwhite", price: "$139.99", recipient: "Emma Thompson", category: "Technology" },
                  { title: "Cooking Masterclass Subscription", price: "$79.99", recipient: "Michael Chen", category: "Experiences" },
                  { title: "Wireless Noise-Cancelling Headphones", price: "$249.99", recipient: "Sarah Johnson", category: "Technology" }
                ].map((recommendation, index) => (
                  <div key={index} className="rounded-lg border border-gray-200 p-4">
                    <div className="mb-1 text-lg font-medium text-gray-900">{recommendation.title}</div>
                    <div className="mb-3 text-pink-500 font-medium">{recommendation.price}</div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">For:</span> {recommendation.recipient}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Category:</span> {recommendation.category}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "dashboard" && showBudgetTracker && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Budget Tracker</h1>
            <p className="text-gray-600">Manage your gift-giving budget and track expenses</p>
            
            {/* Budget Overview */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Annual Budget Overview</h2>
              
              <div className="mb-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Budget</span>
                  <span className="font-medium">${budgetData.totalBudget.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Spent So Far</span>
                  <span className="font-medium">${budgetData.spent.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Remaining</span>
                  <span className="font-medium text-green-600">${(budgetData.totalBudget - budgetData.spent).toFixed(2)}</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4 space-y-2">
                <div className="relative h-2 w-full rounded-full bg-gray-200">
                  <div 
                    className="absolute left-0 top-0 h-2 rounded-full bg-pink-500"
                    style={{ width: `${Math.min(100, (budgetData.spent / budgetData.totalBudget) * 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600">
                You've spent <span className="font-medium">{((budgetData.spent / budgetData.totalBudget) * 100).toFixed(1)}%</span> of your annual gift budget.
              </p>
            </div>
            
            {/* Recipient Budgets */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Budget by Recipient</h2>
                <button className="text-sm text-indigo-600 hover:text-indigo-700">
                  Adjust Budgets
                </button>
              </div>
              
              <div className="space-y-6">
                {budgetData.budgetsByRecipient.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm">
                        ${item.spent.toFixed(2)} <span className="text-gray-500">/ ${item.budget.toFixed(2)}</span>
                      </span>
                    </div>
                    <div className="relative h-2 w-full rounded-full bg-gray-200">
                      <div 
                        className={`absolute left-0 top-0 h-2 rounded-full ${
                          (item.spent / item.budget) > 0.9 ? "bg-red-500" : "bg-green-500"
                        }`}
                        style={{ width: `${Math.min(100, (item.spent / item.budget) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.spent >= item.budget ? (
                        <span className="text-red-500">Budget exceeded by ${(item.spent - item.budget).toFixed(2)}</span>
                      ) : (
                        <span>${(item.budget - item.spent).toFixed(2)} remaining</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Occasion Budgets */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Budget by Occasion</h2>
                <button className="text-sm text-indigo-600 hover:text-indigo-700">
                  Adjust Budgets
                </button>
              </div>
              
              <div className="space-y-6">
                {budgetData.budgetsByOccasion.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.occasion}</span>
                      <span className="text-sm">
                        ${item.spent.toFixed(2)} <span className="text-gray-500">/ ${item.budget.toFixed(2)}</span>
                      </span>
                    </div>
                    <div className="relative h-2 w-full rounded-full bg-gray-200">
                      <div 
                        className={`absolute left-0 top-0 h-2 rounded-full ${
                          (item.spent / item.budget) > 0.9 ? "bg-red-500" : "bg-blue-500"
                        }`}
                        style={{ width: `${Math.min(100, (item.spent / item.budget) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.spent >= item.budget ? (
                        <span className="text-red-500">Budget exceeded by ${(item.spent - item.budget).toFixed(2)}</span>
                      ) : (
                        <span>${(item.budget - item.spent).toFixed(2)} remaining</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recent Purchases */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Gift Purchases</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 rounded-md">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Recipient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Occasion
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {budgetData.recentPurchases.map((purchase) => (
                      <tr key={purchase.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{purchase.item}</div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-gray-500">{purchase.recipient}</div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm font-medium text-pink-600">${purchase.price.toFixed(2)}</div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-gray-500">{purchase.date}</div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-gray-500">{purchase.occasion}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-right">
                <button className="text-sm text-indigo-600 hover:text-indigo-700">
                  View All Purchases
                </button>
              </div>
            </div>
            
            {/* Add Future Budget Planning */}
            <div className="flex space-x-4">
              <button className="inline-flex items-center rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Budget
              </button>
              <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Budget Report
              </button>
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
                { id: 1, name: "Emma Thompson", age: 27, relationship: "Friend", interests: ["Reading", "Hiking", "Photography"], imageUrl: "https://randomuser.me/api/portraits/women/44.jpg" },
                { id: 2, name: "Michael Chen", age: 32, relationship: "Family", interests: ["Cooking", "Gaming", "Travel"], imageUrl: "https://randomuser.me/api/portraits/men/32.jpg" },
                { id: 3, name: "Sarah Johnson", age: 35, relationship: "Colleague", interests: ["Fitness", "Music", "Art"], imageUrl: "https://randomuser.me/api/portraits/women/68.jpg" }
              ].map((recipient) => (
                <div key={recipient.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                  <div className="aspect-square bg-gray-100">
                    <img 
                      src={recipient.imageUrl} 
                      alt={recipient.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="mb-1 text-lg font-medium text-gray-900">{recipient.name}</div>
                    <div className="text-sm text-gray-600">Age: {recipient.age}</div>
                    <div className="text-sm text-gray-600">Relationship: {recipient.relationship}</div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {recipient.interests.map((interest, index) => (
                        <span key={index} className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                          {interest}
                        </span>
                      ))}
                    </div>
                    <button 
                      onClick={() => setSelectedRecipient(recipient)}
                      className="mt-4 w-full rounded-md bg-pink-100 py-2 text-sm font-medium text-pink-700 hover:bg-pink-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === "recipients" && selectedRecipient && !showQuiz && (
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
            
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img 
                    src={selectedRecipient.imageUrl} 
                    alt={selectedRecipient.name} 
                    className="h-full w-full object-cover md:h-80"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <h1 className="mb-4 text-3xl font-bold text-gray-900">{selectedRecipient.name}</h1>
                  
                  <div className="mb-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-500">Age</p>
                      <p className="font-medium">{selectedRecipient.age}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Relationship</p>
                      <p className="font-medium">{selectedRecipient.relationship}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="mb-2 text-sm text-gray-500">Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecipient.interests.map((interest, index) => (
                        <span key={index} className="rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-700">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600">
                      Generate Recommendations
                    </button>
                    <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Gift History & Upcoming Occasions tabs */}
              <div className="border-t border-gray-200 p-6">
                <div className="mb-6 flex gap-4 border-b border-gray-200">
                  <button className="border-b-2 border-pink-500 pb-2 text-sm font-medium text-pink-500">
                    Gift History
                  </button>
                  <button className="pb-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                    Upcoming Occasions
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Kindle Paperwhite</div>
                        <div className="text-sm text-gray-600">Birthday - March 15, 2025</div>
                      </div>
                      <div className="text-lg font-medium text-pink-500">$139.99</div>
                    </div>
                    <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2 text-sm">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
                          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
                          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
                          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
                          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
                          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                        </svg>
                      </div>
                      <div className="font-medium text-green-600">Loved it!</div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Hiking Backpack</div>
                        <div className="text-sm text-gray-600">Christmas - December 25, 2024</div>
                      </div>
                      <div className="text-lg font-medium text-pink-500">$89.99</div>
                    </div>
                    <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2 text-sm">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
                          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
                          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
                          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
                          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </div>
                      <div className="font-medium text-green-600">Really useful!</div>
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
                  <option value="all">All Recipients</option>
                  <option value="1">Emma Thompson</option>
                  <option value="2">Michael Chen</option>
                  <option value="3">Sarah Johnson</option>
                </select>
                <button className="rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600">
                  Generate New
                </button>
              </div>
            </div>
            
            {/* Filter Section */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Filter Recommendations</h2>
              
              <div className="grid gap-6 md:grid-cols-3">
                {/* Price Range Filter */}
                <div>
                  <h3 className="mb-2 text-sm font-medium text-gray-700">Price Range</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">${filterOptions.priceRange[0]}</span>
                      <span className="text-xs text-gray-500">${filterOptions.priceRange[1]}</span>
                    </div>
                    <div className="relative h-2 w-full rounded-md bg-gray-200">
                      <div 
                        className="absolute h-2 rounded-md bg-pink-500"
                        style={{ 
                          left: `${(filterOptions.priceRange[0] / 500) * 100}%`, 
                          width: `${((filterOptions.priceRange[1] - filterOptions.priceRange[0]) / 500) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <div className="flex space-x-4">
                      <input 
                        type="range" 
                        min="0" 
                        max="500"
                        value={filterOptions.priceRange[0]}
                        onChange={(e) => setFilterOptions({
                          ...filterOptions,
                          priceRange: [parseInt(e.target.value), filterOptions.priceRange[1]]
                        })}
                        className="w-full"
                      />
                      <input 
                        type="range" 
                        min="0" 
                        max="500"
                        value={filterOptions.priceRange[1]}
                        onChange={(e) => setFilterOptions({
                          ...filterOptions,
                          priceRange: [filterOptions.priceRange[0], parseInt(e.target.value)]
                        })}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Categories Filter */}
                <div>
                  <h3 className="mb-2 text-sm font-medium text-gray-700">Categories</h3>
                  <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto">
                    {["Technology", "Experiences", "Outdoors", "Gaming", "Creativity", "Home", "Fashion", "Books"].map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          const categories = [...filterOptions.categories];
                          if (categories.includes(category)) {
                            setFilterOptions({
                              ...filterOptions,
                              categories: categories.filter(c => c !== category)
                            });
                          } else {
                            setFilterOptions({
                              ...filterOptions,
                              categories: [...categories, category]
                            });
                          }
                        }}
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          filterOptions.categories.includes(category)
                            ? "bg-pink-100 text-pink-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Occasions Filter */}
                <div>
                  <h3 className="mb-2 text-sm font-medium text-gray-700">Occasions</h3>
                  <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto">
                    {["Birthday", "Anniversary", "Christmas", "Valentine's Day", "Graduation", "Wedding", "Baby Shower"].map((occasion) => (
                      <button
                        key={occasion}
                        onClick={() => {
                          const occasions = [...filterOptions.occasions];
                          if (occasions.includes(occasion)) {
                            setFilterOptions({
                              ...filterOptions,
                              occasions: occasions.filter(o => o !== occasion)
                            });
                          } else {
                            setFilterOptions({
                              ...filterOptions,
                              occasions: [...occasions, occasion]
                            });
                          }
                        }}
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          filterOptions.occasions.includes(occasion)
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {occasion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between border-t border-gray-200 pt-4">
                <button 
                  onClick={() => setFilterOptions({
                    priceRange: [0, 500],
                    categories: [],
                    occasions: []
                  })}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Reset Filters
                </button>
                <button className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600">
                  Apply Filters
                </button>
              </div>
            </div>
            
            {/* Recommendation Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { id: 1, title: "Kindle Paperwhite", price: 139.99, image: "https://m.media-amazon.com/images/I/618T0VprZbL._AC_SL1500_.jpg", recipient: "Emma Thompson", category: "Technology", occasion: "Birthday", rating: 4.8, reviews: 156, description: "The thinnest, lightest Kindle Paperwhite yet—with a flush-front design and 300 ppi glare-free display that reads like real paper even in bright sunlight." },
                { id: 2, title: "Cooking Masterclass Subscription", price: 79.99, image: "https://gordonramsay.com/assets/Uploads/_resampled/CroppedFocusedImage1920108050-50-GRC-Pasta.jpg", recipient: "Michael Chen", category: "Experiences", occasion: "Anniversary", rating: 4.9, reviews: 98, description: "Learn cooking techniques from the world's best chefs with high-quality video lessons and detailed workbooks." },
                { id: 3, title: "Wireless Noise-Cancelling Headphones", price: 249.99, image: "https://m.media-amazon.com/images/I/71+X7OmQPYL._AC_SL1500_.jpg", recipient: "Sarah Johnson", category: "Technology", occasion: "Graduation", rating: 4.7, reviews: 203, description: "Industry-leading noise cancellation technology with premium sound quality and comfortable design for all-day listening." },
                { id: 4, title: "Hiking Backpack", price: 89.99, image: "https://m.media-amazon.com/images/I/91euD0OojiL._AC_SL1500_.jpg", recipient: "Emma Thompson", category: "Outdoors", occasion: "Christmas", rating: 4.6, reviews: 75, description: "Durable, water-resistant backpack with multiple compartments and ergonomic design for comfort on long hikes." },
                { id: 5, title: "Nintendo Switch", price: 299.99, image: "https://m.media-amazon.com/images/I/61-PblYntsL._AC_SL1500_.jpg", recipient: "Michael Chen", category: "Gaming", occasion: "Birthday", rating: 4.9, reviews: 325, description: "The versatile gaming system that lets you play your favorite games at home on the TV or on-the-go." },
                { id: 6, title: "Art Supplies Set", price: 65.99, image: "https://m.media-amazon.com/images/I/81+qScSrDIL._AC_SL1500_.jpg", recipient: "Sarah Johnson", category: "Creativity", occasion: "Christmas", rating: 4.7, reviews: 82, description: "Complete art set with 120 premium pieces including colored pencils, watercolors, pastels, and sketch pads." },
                { id: 7, title: "Insulated Coffee Mug", price: 29.99, image: "https://m.media-amazon.com/images/I/61eDXs9QFNL._AC_SL1500_.jpg", recipient: "Emma Thompson", category: "Home", occasion: "Valentine's Day", rating: 4.8, reviews: 112, description: "Double-walled stainless steel mug that keeps drinks hot for 12 hours or cold for 24 hours." },
                { id: 8, title: "Chef's Knife Set", price: 129.99, image: "https://m.media-amazon.com/images/I/61p2wnYlB3L._AC_SL1000_.jpg", recipient: "Michael Chen", category: "Home", occasion: "Christmas", rating: 4.7, reviews: 89, description: "Professional-grade knife set with high-carbon stainless steel blades and ergonomic handles." },
                { id: 9, title: "Smart Speaker", price: 79.99, image: "https://m.media-amazon.com/images/I/61XLm1sEuDL._AC_SL1000_.jpg", recipient: "Sarah Johnson", category: "Technology", occasion: "Birthday", rating: 4.6, reviews: 145, description: "Premium voice-controlled smart speaker with immersive sound and smart home capabilities." }
              ].map((recommendation) => (
                <div key={recommendation.id} className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm transition-shadow hover:shadow-md">
                  {/* Product Image */}
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    <img
                      src={recommendation.image}
                      alt={recommendation.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <div className="mb-1 text-lg font-medium text-gray-900">{recommendation.title}</div>
                    <div className="mb-3 text-pink-500 font-medium">${recommendation.price.toFixed(2)}</div>
                    
                    {/* Details */}
                    <div className="space-y-1 text-sm">
                      <div className="text-gray-600">
                        <span className="font-medium">For:</span> {recommendation.recipient}
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">Category:</span> {recommendation.category}
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">Occasion:</span> {recommendation.occasion}
                      </div>
                      
                      {/* Ratings */}
                      <div className="flex items-center gap-1">
                        <div className="flex text-yellow-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`h-4 w-4 ${star <= Math.round(recommendation.rating) ? "text-yellow-400" : "text-gray-200"}`}>
                              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">({recommendation.reviews} reviews)</span>
                      </div>
                      
                      {/* Description */}
                      <p className="mt-2 text-xs text-gray-600 line-clamp-2">{recommendation.description}</p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-4 flex gap-2">
                      <button className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200">
                        View Details
                      </button>
                      <button className="rounded-md bg-green-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-600">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="flex justify-center">
              <nav className="flex space-x-1">
                <button className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                <button className="rounded-md bg-pink-50 px-3 py-2 text-sm font-medium text-pink-600">
                  1
                </button>
                <button className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">
                  2
                </button>
                <button className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">
                  3
                </button>
                <button className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;