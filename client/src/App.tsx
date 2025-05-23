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
            
            <Route path="/budget-tracker">
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Budget Tracker</h1>
                <p className="text-gray-600">Track your gift spending and stay within budget.</p>
                
                {/* Overall Budget */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Annual Budget</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Total Budget</p>
                      <p className="text-2xl font-bold text-gray-900">$1,000.00</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Spent So Far</p>
                      <p className="text-2xl font-bold text-pink-500">$437.97</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Remaining</p>
                      <p className="text-2xl font-bold text-green-500">$562.03</p>
                    </div>
                  </div>
                  <div className="mb-2 h-4 w-full overflow-hidden rounded-full bg-gray-200">
                    <div 
                      className="h-full rounded-full bg-pink-500" 
                      style={{ width: "43.8%" }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500">43.8% of budget used</p>
                </div>
                
                {/* Budget By Recipient */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Budget By Recipient</h2>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-gray-100 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="font-medium text-gray-900">Emma Thompson</p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-pink-500">$229.98</span> of $350.00
                        </p>
                      </div>
                      <div className="mb-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div 
                          className="h-full rounded-full bg-pink-500" 
                          style={{ width: "65.7%" }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border border-gray-100 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="font-medium text-gray-900">Michael Chen</p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-pink-500">$79.99</span> of $400.00
                        </p>
                      </div>
                      <div className="mb-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div 
                          className="h-full rounded-full bg-pink-500" 
                          style={{ width: "20%" }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border border-gray-100 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="font-medium text-gray-900">Sarah Johnson</p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-pink-500">$128.00</span> of $250.00
                        </p>
                      </div>
                      <div className="mb-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div 
                          className="h-full rounded-full bg-pink-500" 
                          style={{ width: "51.2%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Budget By Occasion */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Budget By Occasion</h2>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-gray-100 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="font-medium text-gray-900">Birthday</p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-pink-500">$139.99</span> of $450.00
                        </p>
                      </div>
                      <div className="mb-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div 
                          className="h-full rounded-full bg-pink-500" 
                          style={{ width: "31.1%" }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border border-gray-100 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="font-medium text-gray-900">Christmas</p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-pink-500">$155.98</span> of $400.00
                        </p>
                      </div>
                      <div className="mb-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div 
                          className="h-full rounded-full bg-pink-500" 
                          style={{ width: "39%" }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border border-gray-100 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="font-medium text-gray-900">Valentine's Day</p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-pink-500">$142.00</span> of $150.00
                        </p>
                      </div>
                      <div className="mb-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div 
                          className="h-full rounded-full bg-pink-500" 
                          style={{ width: "94.7%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Recent Purchases */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Recent Purchases</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Item</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Recipient</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Occasion</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                          <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        <tr>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">Kindle Paperwhite</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">Emma Thompson</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">Birthday</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">2025-03-15</td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-pink-500">$139.99</td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">Hiking Backpack</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">Emma Thompson</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">Christmas</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">2024-12-25</td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-pink-500">$89.99</td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">Cooking Masterclass</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">Michael Chen</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">Valentine's Day</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">2025-02-14</td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-pink-500">$79.99</td>
                        </tr>
                      </tbody>
                    </table>
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
            
            <Route path="/how-it-works">
              <HowItWorksPage />
            </Route>
            
            <Route path="/learning-demo">
              <LearningDemoPage />
            </Route>
            
            <Route path="/recommendations">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold text-gray-900">Recommendations</h1>
                  <div className="flex gap-4">
                    <select className="block rounded-md border border-gray-300 p-2">
                      <option>All Recipients</option>
                      <option>Emma Thompson</option>
                      <option>Michael Chen</option>
                      <option>Sarah Johnson</option>
                    </select>
                    <button className="bg-pink-500 text-white px-4 py-2 rounded-md font-medium">
                      Generate New
                    </button>
                  </div>
                </div>
                
                {/* Filter controls */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Filter Recommendations</h2>
                  
                  {/* Gift Mood */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-4">Gift Mood</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="border border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-pink-300">
                        <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                          💭
                        </div>
                        <h4 className="font-medium">Thoughtful</h4>
                        <p className="text-xs text-gray-500">Meaningful gifts that show you care</p>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-pink-300">
                        <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                          🎮
                        </div>
                        <h4 className="font-medium">Fun</h4>
                        <p className="text-xs text-gray-500">Playful gifts for joy and laughter</p>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-pink-300">
                        <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                          ❤️
                        </div>
                        <h4 className="font-medium">Romantic</h4>
                        <p className="text-xs text-gray-500">Intimate gifts to express love</p>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-pink-300">
                        <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                          🔧
                        </div>
                        <h4 className="font-medium">Practical</h4>
                        <p className="text-xs text-gray-500">Useful gifts for everyday life</p>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-pink-300">
                        <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                          ✨
                        </div>
                        <h4 className="font-medium">Luxurious</h4>
                        <p className="text-xs text-gray-500">High-end gifts for special occasions</p>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-pink-300">
                        <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                          🎨
                        </div>
                        <h4 className="font-medium">Creative</h4>
                        <p className="text-xs text-gray-500">Artistic gifts to inspire</p>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-pink-300">
                        <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                          📷
                        </div>
                        <h4 className="font-medium">Nostalgic</h4>
                        <p className="text-xs text-gray-500">Gifts that bring back memories</p>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-pink-300">
                        <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                          🧘
                        </div>
                        <h4 className="font-medium">Relaxing</h4>
                        <p className="text-xs text-gray-500">Gifts for stress relief and comfort</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Price Range */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Price Range</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">$0</span>
                        <input 
                          type="range" 
                          min="0" 
                          max="500" 
                          className="h-2 w-full appearance-none rounded-lg bg-gray-200"
                        />
                        <span className="text-sm">$500</span>
                      </div>
                    </div>
                    
                    {/* Categories */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Categories</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Technology</span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Experiences</span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Outdoors</span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Gaming</span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Creativity</span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Home</span>
                      </div>
                    </div>
                    
                    {/* Occasions */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Occasions</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Birthday</span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Anniversary</span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Christmas</span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Valentine's Day</span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Graduation</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Recommendations grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
                    <div className="h-48 bg-gray-100 relative">
                      <img 
                        src="https://images.unsplash.com/photo-1598128558393-70ff21433be0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80" 
                        alt="Kindle Paperwhite" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded">
                        98% Match
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium">Kindle Paperwhite</h3>
                        <p className="text-pink-500 font-bold">$139.99</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">For: Emma Thompson</p>
                      <div className="mt-1 flex items-center text-yellow-400 text-sm">
                        <span>★★★★☆</span>
                        <span className="text-gray-500 ml-1">(423 reviews)</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        Perfect for Emma's love of reading and travel. Waterproof for beach trips.
                      </p>
                      <div className="mt-4 flex gap-2">
                        <button className="bg-pink-500 text-white px-3 py-1.5 rounded-md text-sm font-medium">Buy Now</button>
                        <button className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium">Save</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
                    <div className="h-48 bg-gray-100 relative">
                      <img 
                        src="https://images.unsplash.com/photo-1608889476518-738c9b1dcb40?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80" 
                        alt="Wireless Noise-Cancelling Headphones" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded">
                        95% Match
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium">Wireless Noise-Cancelling Headphones</h3>
                        <p className="text-pink-500 font-bold">$249.99</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">For: Michael Chen</p>
                      <div className="mt-1 flex items-center text-yellow-400 text-sm">
                        <span>★★★★★</span>
                        <span className="text-gray-500 ml-1">(187 reviews)</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        Perfect for Michael's gaming sessions and frequent travel.
                      </p>
                      <div className="mt-4 flex gap-2">
                        <button className="bg-pink-500 text-white px-3 py-1.5 rounded-md text-sm font-medium">Buy Now</button>
                        <button className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium">Save</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
                    <div className="h-48 bg-gray-100 relative">
                      <img 
                        src="https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80" 
                        alt="Fitness Smartwatch" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded">
                        93% Match
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium">Fitness Smartwatch</h3>
                        <p className="text-pink-500 font-bold">$199.99</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">For: Sarah Johnson</p>
                      <div className="mt-1 flex items-center text-yellow-400 text-sm">
                        <span>★★★★☆</span>
                        <span className="text-gray-500 ml-1">(341 reviews)</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        Tracks workouts, heart rate, and sleep - perfect for her fitness routine.
                      </p>
                      <div className="mt-4 flex gap-2">
                        <button className="bg-pink-500 text-white px-3 py-1.5 rounded-md text-sm font-medium">Buy Now</button>
                        <button className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium">Save</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Route>
            
            <Route>
              <div className="space-y-6 text-center py-12">
                <h1 className="text-3xl font-bold text-gray-900">Page Not Found</h1>
                <p className="text-gray-600">The page you're looking for doesn't exist.</p>
                <button 
                  onClick={() => setLocation("/dashboard")}
                  className="inline-flex items-center gap-2 rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600"
                >
                  Go to Dashboard
                </button>
              </div>
            </Route>
          </Switch>
        </div>
      </div>
    );
  }

  // Login form
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
            Sign In
          </button>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <div className="mt-3">
            <button
              onClick={() => window.location.href = '/api/auth/google'}
              className="w-full flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              Sign in with Google
            </button>
          </div>
          
          <div className="text-center text-sm">
            <p className="text-gray-500">
              Don't have an account? <span className="cursor-pointer text-pink-500 hover:underline">Sign up</span>
            </p>
            <p className="mt-2">
              <span className="cursor-pointer text-gray-400 hover:underline" onClick={() => setShowLoginForm(false)}>
                Back to home
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Landing page (not logged in, not showing login form)
  return (
    <div>
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-pink-500" />
            <span className="text-2xl font-bold text-pink-500">GIFT AI</span>
          </div>
          <button 
            onClick={() => setShowLoginForm(true)} 
            className="rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600"
          >
            Sign In
          </button>
        </div>
      </header>
      
      {/* Hero section */}
      <section className="bg-gradient-to-r from-pink-50 to-indigo-50 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
              Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-500">Perfect Gift</span> for Everyone
            </h1>
            <p className="mb-8 text-lg text-gray-600">
              AI-powered gift recommendations tailored to each of your loved ones, making every occasion special.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => setShowLoginForm(true)}
                className="rounded-md bg-pink-500 px-6 py-3 text-base font-medium text-white hover:bg-pink-600"
              >
                Get Started
              </button>
              <button 
                onClick={() => setLocation("/how-it-works")}
                className="rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">How GIFT AI Works</h2>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-pink-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Add Your Recipients</h3>
              <p className="text-gray-600">Create profiles for friends and family members you want to find gifts for.</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-pink-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Answer Questions</h3>
              <p className="text-gray-600">Tell us about their interests, hobbies, and preferences.</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-pink-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Get Recommendations</h3>
              <p className="text-gray-600">Our AI generates personalized gift suggestions based on their profile.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Interactive Testimonials Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied customers who found the perfect gifts with GIFT AI
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 border border-pink-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face" 
                  alt="Sarah" 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-900">Sarah Johnson</h4>
                  <p className="text-gray-600 text-sm">Mother of 3</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex text-yellow-400 mb-2">
                  {"★".repeat(5)}
                </div>
                <p className="text-gray-700 italic">
                  "GIFT AI saved my Christmas! I was struggling to find gifts for my family, but the AI recommendations were spot-on. My husband loved his tech gadget, and my kids were thrilled with their personalized books."
                </p>
              </div>
              <div className="text-pink-600 font-semibold">
                Saved 15+ hours of shopping
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" 
                  alt="Michael" 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-900">Michael Chen</h4>
                  <p className="text-gray-600 text-sm">Software Engineer</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex text-yellow-400 mb-2">
                  {"★".repeat(5)}
                </div>
                <p className="text-gray-700 italic">
                  "As someone who's terrible at gift-giving, GIFT AI is a game-changer. The AI understood my girlfriend's style better than I did! She was amazed by how thoughtful the jewelry recommendation was."
                </p>
              </div>
              <div className="text-blue-600 font-semibold">
                Perfect match every time
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" 
                  alt="Emma" 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-900">Emma Rodriguez</h4>
                  <p className="text-gray-600 text-sm">Marketing Director</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex text-yellow-400 mb-2">
                  {"★".repeat(5)}
                </div>
                <p className="text-gray-700 italic">
                  "I manage gifts for a large team at work. GIFT AI helps me find personalized gifts within budget for birthdays and holidays. My colleagues are always surprised by how well the gifts match their interests!"
                </p>
              </div>
              <div className="text-green-600 font-semibold">
                Managed 50+ successful gifts
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600 mb-2">10K+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600 mb-2">95%</div>
                <div className="text-gray-600">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600 mb-2">50K+</div>
                <div className="text-gray-600">Gifts Recommended</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600 mb-2">4.9★</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Company Info */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-8 w-8 text-pink-400" />
                <span className="text-2xl font-bold">GIFT AI</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                AI-powered gift recommendations that make every occasion special. Find the perfect gift for everyone on your list.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.758-1.378l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Product</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Mobile App</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Investors</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partners</a></li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Live Chat</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 GIFT AI. All rights reserved.
              </div>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Accessibility</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;