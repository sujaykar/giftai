import { useState, useEffect } from "react";
import { Sparkles, Heart, Gift, Share2 } from "lucide-react";
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
    }
  }, [location]);
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
  const [filters, setFilters] = useState({
    recipient: "",
    occasion: "",
    priceRange: "",
    category: ""
  });
  const [filtersApplied, setFiltersApplied] = useState(false);
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
  
  // Function to handle logout
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
              {/* Hero section */}
              <header className="bg-white">
                <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
                  <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
                    <h1 className="mt-10 max-w-lg text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                      Find The Perfect Gift Every Time
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                      GIFT AI combines advanced artificial intelligence with deep understanding of relationships to help you discover thoughtful, meaningful gifts for everyone in your life.
                    </p>
                    <div className="mt-10 flex items-center gap-x-6">
                      <button
                        onClick={() => setLoggedIn(true)}
                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Get Started
                      </button>
                      <button
                        onClick={() => setLocation("/how-it-works")}
                        className="text-sm font-semibold leading-6 text-gray-900"
                      >
                        Learn More <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  </div>
                  <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
                    <img
                      className="mx-auto w-[22.875rem] max-w-full drop-shadow-xl"
                      src="https://www.transparentpng.com/thumb/gift/red-with-bow-gift-png-2.png"
                      alt="Gift box"
                    />
                  </div>
                </div>
              </header>

              {/* Features section */}
              <div className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                  <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-indigo-600">Give Better Gifts</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                      Why Choose GIFT AI?
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                      Our platform combines cutting-edge AI with deep relationship understanding to help you find gifts that truly matter.
                    </p>
                  </div>
                  <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                      <div className="relative pl-16">
                        <dt className="text-base font-semibold leading-7 text-gray-900">
                          <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                            <Heart className="h-6 w-6 text-white" aria-hidden="true" />
                          </div>
                          Personalized Recommendations
                        </dt>
                        <dd className="mt-2 text-base leading-7 text-gray-600">
                          Our AI analyzes the unique relationship between you and the recipient to suggest gifts that strengthen your connection.
                        </dd>
                      </div>
                      <div className="relative pl-16">
                        <dt className="text-base font-semibold leading-7 text-gray-900">
                          <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                            <Gift className="h-6 w-6 text-white" aria-hidden="true" />
                          </div>
                          Smart Occasion Tracking
                        </dt>
                        <dd className="mt-2 text-base leading-7 text-gray-600">
                          Never miss an important date with our reminder system that learns from your gift-giving patterns.
                        </dd>
                      </div>
                      <div className="relative pl-16">
                        <dt className="text-base font-semibold leading-7 text-gray-900">
                          <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                            <Sparkles className="h-6 w-6 text-white" aria-hidden="true" />
                          </div>
                          Budget Management
                        </dt>
                        <dd className="mt-2 text-base leading-7 text-gray-600">
                          Set and track budgets for different recipients and occasions to maintain control over your gift-giving expenses.
                        </dd>
                      </div>
                      <div className="relative pl-16">
                        <dt className="text-base font-semibold leading-7 text-gray-900">
                          <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                            <Share2 className="h-6 w-6 text-white" aria-hidden="true" />
                          </div>
                          Social Integration
                        </dt>
                        <dd className="mt-2 text-base leading-7 text-gray-600">
                          Easily share gift ideas with friends and family or collaborate on group gifts for special occasions.
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>

              {/* CTA section */}
              <div className="bg-indigo-600">
                <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-between lg:px-8">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Ready to discover perfect gifts?
                    <br />
                    Get started with GIFT AI today.
                  </h2>
                  <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
                    <button
                      onClick={() => setLoggedIn(true)}
                      className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      Get Started
                    </button>
                    <button
                      onClick={() => setLocation("/how-it-works")}
                      className="text-sm font-semibold leading-6 text-white"
                    >
                      Learn More <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer className="bg-gray-900 text-white py-12">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="mb-8 md:mb-0">
                      <h2 className="text-2xl font-bold mb-4">GIFT AI</h2>
                      <p className="max-w-sm text-gray-400">
                        Revolutionizing gift-giving with intelligent, relationship-based recommendations.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-300 mb-4">Product</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                          <li><a href="#" className="hover:text-white">Features</a></li>
                          <li><a href="#" className="hover:text-white">Pricing</a></li>
                          <li><a href="#" className="hover:text-white">FAQ</a></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-300 mb-4">Company</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                          <li><a href="#" className="hover:text-white">About</a></li>
                          <li><a href="#" className="hover:text-white">Blog</a></li>
                          <li><a href="#" className="hover:text-white">Careers</a></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-300 mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                          <li><a href="#" className="hover:text-white">Privacy</a></li>
                          <li><a href="#" className="hover:text-white">Terms</a></li>
                          <li><a href="#" className="hover:text-white">Contact</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-400">© 2025 GIFT AI. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                      <a href="#" className="text-gray-400 hover:text-white">
                        <span className="sr-only">Facebook</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href="#" className="text-gray-400 hover:text-white">
                        <span className="sr-only">Twitter</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                      <a href="#" className="text-gray-400 hover:text-white">
                        <span className="sr-only">Instagram</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
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
              {activeTab === "dashboard" && !showBudgetTracker && (
                <div className="space-y-6">
                  {/* Upcoming occasions */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-gray-900">Upcoming Occasions</h2>
                      <button className="text-sm text-indigo-600 hover:text-indigo-800">View All</button>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center p-3 bg-indigo-50 rounded-lg">
                        <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-indigo-600">15</span>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">Emma's Birthday</p>
                          <p className="text-sm text-gray-500">March 15, 2025 (2 weeks away)</p>
                        </div>
                        <div className="ml-auto">
                          <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">Find Gifts</button>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-pink-50 rounded-lg">
                        <div className="flex-shrink-0 h-12 w-12 bg-pink-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-pink-600">14</span>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">Valentine's Day</p>
                          <p className="text-sm text-gray-500">February 14, 2025 (9 months away)</p>
                        </div>
                        <div className="ml-auto">
                          <button className="px-3 py-1 bg-pink-600 text-white text-sm rounded hover:bg-pink-700">Find Gifts</button>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-green-50 rounded-lg">
                        <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-green-600">25</span>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">Christmas</p>
                          <p className="text-sm text-gray-500">December 25, 2024 (7 months away)</p>
                        </div>
                        <div className="ml-auto">
                          <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">Find Gifts</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recipients */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-gray-900">Recipients</h2>
                      <button 
                        onClick={() => setActiveTab("recipients")}
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        View All
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
                        <h3 className="font-semibold text-gray-900">Emma Thompson</h3>
                        <p className="text-sm text-gray-600">Friend</p>
                        <button 
                          onClick={() => {
                            setSelectedRecipient({ name: "Emma Thompson", relationship: "Friend" });
                            setShowQuiz(true);
                          }}
                          className="mt-2 text-xs px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                          Update Preferences
                        </button>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
                        <h3 className="font-semibold text-gray-900">Michael Chen</h3>
                        <p className="text-sm text-gray-600">Family</p>
                        <button 
                          onClick={() => {
                            setSelectedRecipient({ name: "Michael Chen", relationship: "Family" });
                            setShowQuiz(true);
                          }}
                          className="mt-2 text-xs px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                          Update Preferences
                        </button>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
                        <h3 className="font-semibold text-gray-900">Sarah Johnson</h3>
                        <p className="text-sm text-gray-600">Colleague</p>
                        <button 
                          onClick={() => {
                            setSelectedRecipient({ name: "Sarah Johnson", relationship: "Colleague" });
                            setShowQuiz(true);
                          }}
                          className="mt-2 text-xs px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                          Update Preferences
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <button 
                        onClick={() => {
                          setSelectedRecipient(null);
                          setShowQuiz(true);
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Add New Recipient
                      </button>
                    </div>
                  </div>

                  {/* Gift Recommendations */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-gray-900">Recent Recommendations</h2>
                      <button 
                        onClick={() => setActiveTab("recommendations")}
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        View All
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="h-40 bg-gray-100">
                          <img 
                            src="https://m.media-amazon.com/images/I/61p2wnYlB3L._AC_SL1000_.jpg" 
                            alt="Chef's Knife Set" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <p className="text-xs text-gray-500">For: Michael Chen</p>
                          <h3 className="font-semibold text-gray-900 mb-1">Chef's Knife Set</h3>
                          <p className="text-sm text-gray-700 mb-2 line-clamp-2">Professional-grade knife set with high-carbon stainless steel blades.</p>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-900">$129.99</span>
                            <button className="text-xs px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">View</button>
                          </div>
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="h-40 bg-gray-100">
                          <img 
                            src="https://m.media-amazon.com/images/I/618T0VprZbL._AC_SL1500_.jpg" 
                            alt="Kindle Paperwhite" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <p className="text-xs text-gray-500">For: Emma Thompson</p>
                          <h3 className="font-semibold text-gray-900 mb-1">Kindle Paperwhite</h3>
                          <p className="text-sm text-gray-700 mb-2 line-clamp-2">Waterproof e-reader with a flush-front design and 300 ppi glare-free display.</p>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-900">$139.99</span>
                            <button className="text-xs px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">View</button>
                          </div>
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="h-40 bg-gray-100">
                          <img 
                            src="https://m.media-amazon.com/images/I/81+qScSrDIL._AC_SL1500_.jpg" 
                            alt="Art Supplies Set" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <p className="text-xs text-gray-500">For: Sarah Johnson</p>
                          <h3 className="font-semibold text-gray-900 mb-1">Art Supplies Set</h3>
                          <p className="text-sm text-gray-700 mb-2 line-clamp-2">Complete art set with 120 premium pieces including colored pencils and watercolors.</p>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-900">$65.99</span>
                            <button className="text-xs px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">View</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "dashboard" && showBudgetTracker && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Budget Tracker</h2>
                  
                  {/* Overall Budget */}
                  <div className="mb-8">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-semibold text-gray-700">Total Budget</h3>
                      <p className="font-semibold text-gray-900">${budgetData.spent.toFixed(2)} / ${budgetData.totalBudget.toFixed(2)}</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-indigo-600 h-2.5 rounded-full" 
                        style={{ width: `${(budgetData.spent / budgetData.totalBudget) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Budget By Recipient */}
                  <div className="mb-8">
                    <h3 className="font-semibold text-gray-900 mb-4">Budget By Recipient</h3>
                    <div className="space-y-4">
                      {budgetData.budgetsByRecipient.map((item) => (
                        <div key={item.id}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-700">{item.name}</span>
                            <span className="text-sm text-gray-900">${item.spent.toFixed(2)} / ${item.budget.toFixed(2)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                item.spent / item.budget > 0.9 ? 'bg-red-500' : 
                                item.spent / item.budget > 0.7 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min((item.spent / item.budget) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Budget By Occasion */}
                  <div className="mb-8">
                    <h3 className="font-semibold text-gray-900 mb-4">Budget By Occasion</h3>
                    <div className="space-y-4">
                      {budgetData.budgetsByOccasion.map((item, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-700">{item.occasion}</span>
                            <span className="text-sm text-gray-900">${item.spent.toFixed(2)} / ${item.budget.toFixed(2)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                item.spent / item.budget > 0.9 ? 'bg-red-500' : 
                                item.spent / item.budget > 0.7 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min((item.spent / item.budget) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Recent Purchases */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Recent Purchases</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occasion</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {budgetData.recentPurchases.map((purchase) => (
                            <tr key={purchase.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{purchase.item}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.recipient}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.occasion}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${purchase.price.toFixed(2)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "recipients" && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Manage Recipients</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex items-center mb-4">
                        <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-900">Emma Thompson</h3>
                          <p className="text-sm text-gray-600">Friend</p>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div>
                          <span className="text-xs text-gray-500">Next Occasion:</span>
                          <p className="text-sm text-gray-700">Birthday - March 15, 2025</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Interests:</span>
                          <p className="text-sm text-gray-700">Reading, Hiking, Photography</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Budget:</span>
                          <p className="text-sm text-gray-700">$100 - $200</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedRecipient({ name: "Emma Thompson", relationship: "Friend" });
                            setShowQuiz(true);
                          }}
                          className="flex-1 text-xs px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                          Edit
                        </button>
                        <button className="text-xs px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                          View Gifts
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex items-center mb-4">
                        <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-900">Michael Chen</h3>
                          <p className="text-sm text-gray-600">Family</p>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div>
                          <span className="text-xs text-gray-500">Next Occasion:</span>
                          <p className="text-sm text-gray-700">Christmas - December 25, 2024</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Interests:</span>
                          <p className="text-sm text-gray-700">Cooking, Technology, Gaming</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Budget:</span>
                          <p className="text-sm text-gray-700">$50 - $150</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedRecipient({ name: "Michael Chen", relationship: "Family" });
                            setShowQuiz(true);
                          }}
                          className="flex-1 text-xs px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                          Edit
                        </button>
                        <button className="text-xs px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                          View Gifts
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex items-center mb-4">
                        <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-900">Sarah Johnson</h3>
                          <p className="text-sm text-gray-600">Colleague</p>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div>
                          <span className="text-xs text-gray-500">Next Occasion:</span>
                          <p className="text-sm text-gray-700">Birthday - January 20, 2025</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Interests:</span>
                          <p className="text-sm text-gray-700">Art, Music, Fashion</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Budget:</span>
                          <p className="text-sm text-gray-700">$30 - $80</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedRecipient({ name: "Sarah Johnson", relationship: "Colleague" });
                            setShowQuiz(true);
                          }}
                          className="flex-1 text-xs px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                          Edit
                        </button>
                        <button className="text-xs px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                          View Gifts
                        </button>
                      </div>
                    </div>
                    
                    {/* Add New Recipient */}
                    <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
                      <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Add New Recipient</h3>
                      <p className="text-sm text-gray-600 mb-4">Create a profile for someone you want to find gifts for</p>
                      <button 
                        onClick={() => {
                          setSelectedRecipient(null);
                          setShowQuiz(true);
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Add Person
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "recommendations" && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Gift Recommendations</h2>
                  
                  {/* Filters */}
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Filter Recommendations</h3>
                      <button 
                        onClick={() => {
                          // Reset all filters to default
                          setFilters({
                            recipient: "",
                            occasion: "",
                            priceRange: "",
                            category: ""
                          });
                          // Reset applied state
                          setFiltersApplied(false);
                        }}
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        Reset All Filters
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
                        <select 
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={filters.recipient}
                          onChange={(e) => setFilters({...filters, recipient: e.target.value})}
                        >
                          <option value="">All Recipients</option>
                          <option value="Emma Thompson">Emma Thompson</option>
                          <option value="Michael Chen">Michael Chen</option>
                          <option value="Sarah Johnson">Sarah Johnson</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select 
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={filters.category}
                          onChange={(e) => setFilters({...filters, category: e.target.value})}
                        >
                          <option value="">All Categories</option>
                          <option value="Technology">Technology</option>
                          <option value="Home">Home</option>
                          <option value="Outdoors">Outdoors</option>
                          <option value="Creativity">Creativity</option>
                          <option value="Experiences">Experiences</option>
                          <option value="Gaming">Gaming</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Occasion</label>
                        <select 
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={filters.occasion}
                          onChange={(e) => setFilters({...filters, occasion: e.target.value})}
                        >
                          <option value="">All Occasions</option>
                          <option value="Birthday">Birthday</option>
                          <option value="Christmas">Christmas</option>
                          <option value="Valentine's Day">Valentine's Day</option>
                          <option value="Anniversary">Anniversary</option>
                          <option value="Graduation">Graduation</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                        <select 
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={filters.priceRange}
                          onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                        >
                          <option value="">Any Price</option>
                          <option value="under-25">Under $25</option>
                          <option value="25-50">$25 - $50</option>
                          <option value="50-100">$50 - $100</option>
                          <option value="100-200">$100 - $200</option>
                          <option value="over-200">Over $200</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <button 
                        onClick={() => {
                          // Apply the filters
                          setFiltersApplied(true);
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Apply Filters
                      </button>
                    </div>
                    
                    {filtersApplied && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Applied Filters:</h4>
                        <div className="flex flex-wrap gap-2">
                          {filters.recipient && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              Recipient: {filters.recipient}
                              <button 
                                onClick={() => setFilters({...filters, recipient: ""})}
                                className="ml-1.5 text-indigo-600 hover:text-indigo-900"
                              >
                                ×
                              </button>
                            </span>
                          )}
                          
                          {filters.category && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              Category: {filters.category}
                              <button 
                                onClick={() => setFilters({...filters, category: ""})}
                                className="ml-1.5 text-indigo-600 hover:text-indigo-900"
                              >
                                ×
                              </button>
                            </span>
                          )}
                          
                          {filters.occasion && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              Occasion: {filters.occasion}
                              <button 
                                onClick={() => setFilters({...filters, occasion: ""})}
                                className="ml-1.5 text-indigo-600 hover:text-indigo-900"
                              >
                                ×
                              </button>
                            </span>
                          )}
                          
                          {filters.priceRange && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              Price: {
                                filters.priceRange === "under-25" ? "Under $25" :
                                filters.priceRange === "25-50" ? "$25 - $50" :
                                filters.priceRange === "50-100" ? "$50 - $100" :
                                filters.priceRange === "100-200" ? "$100 - $200" :
                                filters.priceRange === "over-200" ? "Over $200" : ""
                              }
                              <button 
                                onClick={() => setFilters({...filters, priceRange: ""})}
                                className="ml-1.5 text-indigo-600 hover:text-indigo-900"
                              >
                                ×
                              </button>
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Recommendations Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Recommendation Products */}
                    {[
                      // Kindle Paperwhite
                      { 
                        id: 1, 
                        title: "Kindle Paperwhite", 
                        price: 139.99, 
                        image: "https://m.media-amazon.com/images/I/618T0VprZbL._AC_SL1500_.jpg", 
                        recipient: "Emma Thompson", 
                        category: "Technology", 
                        occasion: "Birthday", 
                        rating: 4.8, 
                        reviews: 156, 
                        description: "The thinnest, lightest Kindle Paperwhite yet—with a flush-front design and 300 ppi glare-free display that reads like real paper even in bright sunlight."
                      },
                      
                      // Chef's Knife Set
                      {
                        id: 2,
                        title: "Chef's Knife Set",
                        price: 129.99,
                        image: "https://m.media-amazon.com/images/I/61p2wnYlB3L._AC_SL1000_.jpg",
                        recipient: "Michael Chen",
                        category: "Home",
                        occasion: "Christmas",
                        rating: 4.7,
                        reviews: 89,
                        description: "Professional-grade knife set with high-carbon stainless steel blades and ergonomic handles for precise cutting."
                      },
                      
                      // Art Supplies Set
                      {
                        id: 3,
                        title: "Art Supplies Set",
                        price: 65.99,
                        image: "https://m.media-amazon.com/images/I/81+qScSrDIL._AC_SL1500_.jpg",
                        recipient: "Sarah Johnson",
                        category: "Creativity",
                        occasion: "Christmas",
                        rating: 4.7,
                        reviews: 82,
                        description: "Complete art set with 120 premium pieces including colored pencils, watercolors, pastels, and sketch pads."
                      },
                      
                      // Wireless Headphones
                      {
                        id: 4,
                        title: "Wireless Noise-Cancelling Headphones",
                        price: 249.99,
                        image: "https://m.media-amazon.com/images/I/71+X7OmQPYL._AC_SL1500_.jpg",
                        recipient: "Sarah Johnson",
                        category: "Technology",
                        occasion: "Graduation",
                        rating: 4.7,
                        reviews: 203,
                        description: "Industry-leading noise cancellation with premium sound quality and comfortable design for all-day listening."
                      },
                      
                      // Hiking Backpack
                      {
                        id: 5,
                        title: "Hiking Backpack",
                        price: 89.99,
                        image: "https://m.media-amazon.com/images/I/91euD0OojiL._AC_SL1500_.jpg",
                        recipient: "Emma Thompson",
                        category: "Outdoors",
                        occasion: "Christmas",
                        rating: 4.6,
                        reviews: 75,
                        description: "Durable, water-resistant backpack with multiple compartments and ergonomic design for comfort on long hikes."
                      },
                      
                      // Nintendo Switch
                      {
                        id: 6,
                        title: "Nintendo Switch",
                        price: 299.99,
                        image: "https://m.media-amazon.com/images/I/61-PblYntsL._AC_SL1500_.jpg",
                        recipient: "Michael Chen",
                        category: "Gaming",
                        occasion: "Birthday",
                        rating: 4.9,
                        reviews: 325,
                        description: "The versatile gaming system that lets you play your favorite games at home on the TV or on-the-go."
                      }
                    ]
                    // Apply filters to the recommendations
                    .filter(item => {
                      if (!filtersApplied) return true;
                      
                      // Filter by recipient
                      const matchesRecipient = !filters.recipient || item.recipient === filters.recipient;
                      
                      // Filter by category
                      const matchesCategory = !filters.category || item.category === filters.category;
                      
                      // Filter by occasion
                      const matchesOccasion = !filters.occasion || item.occasion === filters.occasion;
                      
                      // Filter by price range
                      let matchesPrice = true;
                      if (filters.priceRange) {
                        switch (filters.priceRange) {
                          case 'under-25':
                            matchesPrice = item.price < 25;
                            break;
                          case '25-50':
                            matchesPrice = item.price >= 25 && item.price <= 50;
                            break;
                          case '50-100':
                            matchesPrice = item.price > 50 && item.price <= 100;
                            break;
                          case '100-200':
                            matchesPrice = item.price > 100 && item.price <= 200;
                            break;
                          case 'over-200':
                            matchesPrice = item.price > 200;
                            break;
                        }
                      }
                      
                      return matchesRecipient && matchesCategory && matchesOccasion && matchesPrice;
                    })
                    .map(product => (
                      <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="h-48 bg-gray-100">
                          <img 
                            src={product.image} 
                            alt={product.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-xs text-gray-500">For: {product.recipient}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full 
                              ${product.occasion === 'Birthday' ? 'bg-indigo-100 text-indigo-800' : 
                                product.occasion === 'Christmas' ? 'bg-green-100 text-green-800' : 
                                product.occasion === 'Graduation' ? 'bg-blue-100 text-blue-800' : 
                                product.occasion === 'Anniversary' ? 'bg-pink-100 text-pink-800' : 
                                product.occasion === 'Valentine\'s Day' ? 'bg-red-100 text-red-800' : 
                                'bg-gray-100 text-gray-800'}`}>
                              {product.occasion}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{product.title}</h3>
                          <div className="flex items-center mb-2">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, index) => (
                                <svg key={index} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 ml-2">{product.rating} ({product.reviews} reviews)</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
                            <div className="flex space-x-2">
                              <button className="text-xs px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                                Details
                              </button>
                              <button className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                                Purchase
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* No Results Message */}
                  {filtersApplied && 
                    [
                      { id: 1, title: "Kindle Paperwhite", price: 139.99, image: "https://m.media-amazon.com/images/I/618T0VprZbL._AC_SL1500_.jpg", recipient: "Emma Thompson", category: "Technology", occasion: "Birthday", rating: 4.8, reviews: 156, description: "The thinnest, lightest Kindle Paperwhite yet—with a flush-front design and 300 ppi glare-free display that reads like real paper even in bright sunlight." },
                      { id: 2, title: "Chef's Knife Set", price: 129.99, image: "https://m.media-amazon.com/images/I/61p2wnYlB3L._AC_SL1000_.jpg", recipient: "Michael Chen", category: "Home", occasion: "Christmas", rating: 4.7, reviews: 89, description: "Professional-grade knife set with high-carbon stainless steel blades and ergonomic handles for precise cutting." },
                      { id: 3, title: "Art Supplies Set", price: 65.99, image: "https://m.media-amazon.com/images/I/81+qScSrDIL._AC_SL1500_.jpg", recipient: "Sarah Johnson", category: "Creativity", occasion: "Christmas", rating: 4.7, reviews: 82, description: "Complete art set with 120 premium pieces including colored pencils, watercolors, pastels, and sketch pads." },
                      { id: 4, title: "Wireless Noise-Cancelling Headphones", price: 249.99, image: "https://m.media-amazon.com/images/I/71+X7OmQPYL._AC_SL1500_.jpg", recipient: "Sarah Johnson", category: "Technology", occasion: "Graduation", rating: 4.7, reviews: 203, description: "Industry-leading noise cancellation with premium sound quality and comfortable design for all-day listening." },
                      { id: 5, title: "Hiking Backpack", price: 89.99, image: "https://m.media-amazon.com/images/I/91euD0OojiL._AC_SL1500_.jpg", recipient: "Emma Thompson", category: "Outdoors", occasion: "Christmas", rating: 4.6, reviews: 75, description: "Durable, water-resistant backpack with multiple compartments and ergonomic design for comfort on long hikes." },
                      { id: 6, title: "Nintendo Switch", price: 299.99, image: "https://m.media-amazon.com/images/I/61-PblYntsL._AC_SL1500_.jpg", recipient: "Michael Chen", category: "Gaming", occasion: "Birthday", rating: 4.9, reviews: 325, description: "The versatile gaming system that lets you play your favorite games at home on the TV or on-the-go." }
                    ].filter(item => {
                      // Filter by recipient
                      const matchesRecipient = !filters.recipient || item.recipient === filters.recipient;
                      
                      // Filter by category
                      const matchesCategory = !filters.category || item.category === filters.category;
                      
                      // Filter by occasion
                      const matchesOccasion = !filters.occasion || item.occasion === filters.occasion;
                      
                      // Filter by price range
                      let matchesPrice = true;
                      if (filters.priceRange) {
                        switch (filters.priceRange) {
                          case 'under-25':
                            matchesPrice = item.price < 25;
                            break;
                          case '25-50':
                            matchesPrice = item.price >= 25 && item.price <= 50;
                            break;
                          case '50-100':
                            matchesPrice = item.price > 50 && item.price <= 100;
                            break;
                          case '100-200':
                            matchesPrice = item.price > 100 && item.price <= 200;
                            break;
                          case 'over-200':
                            matchesPrice = item.price > 200;
                            break;
                        }
                      }
                      
                      return matchesRecipient && matchesCategory && matchesOccasion && matchesPrice;
                    }).length === 0 && (
                      <div className="text-center py-16 bg-white rounded-lg shadow-sm mt-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No matching recommendations found</h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">We couldn't find any gifts matching your current filter selections. Try adjusting your filters to see more options.</p>
                        <button 
                          onClick={() => {
                            setFilters({
                              recipient: "",
                              occasion: "",
                              priceRange: "",
                              category: ""
                            });
                            setFiltersApplied(false);
                          }}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                          Reset All Filters
                        </button>
                      </div>
                    )
                  }
                  
                  {/* Pagination */}
                  <div className="mt-6 flex justify-center">
                    <nav>
                      <ul className="flex space-x-2">
                        <li>
                          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50">
                            Previous
                          </button>
                        </li>
                        <li>
                          <button className="px-3 py-1 border border-indigo-500 bg-indigo-50 rounded-md text-sm text-indigo-600">
                            1
                          </button>
                        </li>
                        <li>
                          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50">
                            2
                          </button>
                        </li>
                        <li>
                          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50">
                            3
                          </button>
                        </li>
                        <li>
                          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50">
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              )}
              
              {/* Recipient Quiz Modal */}
              {showQuiz && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                  <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowQuiz(false)}></div>
                    <span className="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>
                    <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                          <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                              {selectedRecipient ? `Update Profile for ${selectedRecipient.name}` : "Add New Recipient"}
                            </h3>
                            <div className="mt-4">
                              {quizStep === 1 && (
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
                                    <input 
                                      type="text" 
                                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                      placeholder="Enter name"
                                      value={quizRecipient.name}
                                      onChange={(e) => setQuizRecipient({...quizRecipient, name: e.target.value})}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Age (optional)</label>
                                    <input 
                                      type="text" 
                                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                      placeholder="Enter age"
                                      value={quizRecipient.age}
                                      onChange={(e) => setQuizRecipient({...quizRecipient, age: e.target.value})}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                                    <select 
                                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                      value={quizRecipient.relationship}
                                      onChange={(e) => setQuizRecipient({...quizRecipient, relationship: e.target.value})}
                                    >
                                      <option>Friend</option>
                                      <option>Family</option>
                                      <option>Partner</option>
                                      <option>Colleague</option>
                                      <option>Other</option>
                                    </select>
                                  </div>
                                </div>
                              )}
                              
                              {quizStep === 2 && (
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Interests (select all that apply)</label>
                                    <div className="grid grid-cols-2 gap-2">
                                      {["Reading", "Cooking", "Technology", "Sports", "Art", "Music", "Gaming", "Fashion", "Travel", "Fitness", "Home Decor", "Gardening"].map((interest, index) => (
                                        <div key={index} className="flex items-center">
                                          <input 
                                            type="checkbox" 
                                            id={`interest-${index}`}
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            checked={quizRecipient.interests.includes(interest)}
                                            onChange={(e) => {
                                              if (e.target.checked) {
                                                setQuizRecipient({
                                                  ...quizRecipient, 
                                                  interests: [...quizRecipient.interests, interest]
                                                });
                                              } else {
                                                setQuizRecipient({
                                                  ...quizRecipient, 
                                                  interests: quizRecipient.interests.filter(i => i !== interest)
                                                });
                                              }
                                            }}
                                          />
                                          <label htmlFor={`interest-${index}`} className="ml-2 text-sm text-gray-700">
                                            {interest}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {quizStep === 3 && (
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Important Occasions</label>
                                    <div className="space-y-2">
                                      {quizRecipient.occasions.map((occasion, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                          <select 
                                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            value={occasion.type}
                                            onChange={(e) => {
                                              const updatedOccasions = [...quizRecipient.occasions];
                                              updatedOccasions[index].type = e.target.value;
                                              setQuizRecipient({...quizRecipient, occasions: updatedOccasions});
                                            }}
                                          >
                                            <option>Birthday</option>
                                            <option>Anniversary</option>
                                            <option>Christmas</option>
                                            <option>Valentine's Day</option>
                                            <option>Graduation</option>
                                            <option>Other</option>
                                          </select>
                                          <input 
                                            type="date" 
                                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            value={occasion.date}
                                            onChange={(e) => {
                                              const updatedOccasions = [...quizRecipient.occasions];
                                              updatedOccasions[index].date = e.target.value;
                                              setQuizRecipient({...quizRecipient, occasions: updatedOccasions});
                                            }}
                                          />
                                          <button 
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => {
                                              setQuizRecipient({
                                                ...quizRecipient, 
                                                occasions: quizRecipient.occasions.filter((_, i) => i !== index)
                                              });
                                            }}
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                          </button>
                                        </div>
                                      ))}
                                      <button 
                                        className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                                        onClick={() => {
                                          setQuizRecipient({
                                            ...quizRecipient, 
                                            occasions: [...quizRecipient.occasions, { type: "Birthday", date: "" }]
                                          });
                                        }}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Add Occasion
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {quizStep === 4 && (
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gift Budget Range</label>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm text-gray-500">$</span>
                                      <input 
                                        type="number" 
                                        className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={quizRecipient.budget.min}
                                        onChange={(e) => setQuizRecipient({
                                          ...quizRecipient, 
                                          budget: {...quizRecipient.budget, min: parseInt(e.target.value)}
                                        })}
                                      />
                                      <span className="text-sm text-gray-500">to</span>
                                      <span className="text-sm text-gray-500">$</span>
                                      <input 
                                        type="number" 
                                        className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={quizRecipient.budget.max}
                                        onChange={(e) => setQuizRecipient({
                                          ...quizRecipient, 
                                          budget: {...quizRecipient.budget, max: parseInt(e.target.value)}
                                        })}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 flex justify-between sm:px-6">
                        {quizStep > 1 && (
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => setQuizStep(quizStep - 1)}
                          >
                            Back
                          </button>
                        )}
                        <div>
                          <button
                            type="button"
                            className="mr-2 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => setShowQuiz(false)}
                          >
                            Cancel
                          </button>
                          {quizStep < 4 ? (
                            <button
                              type="button"
                              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              onClick={() => setQuizStep(quizStep + 1)}
                            >
                              Next
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              onClick={() => {
                                // Save recipient data
                                setShowQuiz(false);
                                // Reset quiz state
                                setQuizStep(1);
                                setQuizRecipient({
                                  name: "",
                                  age: "",
                                  relationship: "Friend",
                                  interests: [],
                                  occasions: [],
                                  budget: { min: 25, max: 100 }
                                });
                              }}
                            >
                              Save
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;