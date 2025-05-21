import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { Route, Switch, useLocation } from "wouter";
import { FullNav } from "./components/MainNav";

function App() {
  const [loggedIn, setLoggedIn] = useState(true); // Set to true for development
  const [activeTab, setActiveTab] = useState("dashboard");
  const [location, setLocation] = useLocation();
  const [showLoginForm, setShowLoginForm] = useState(false);

  // Set active tab based on current location
  useEffect(() => {
    setActiveTab(determineActiveTab());
  }, [location]);

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

  // Determine active tab from location
  const determineActiveTab = () => {
    if (location === "/" || location === "/dashboard") {
      return "dashboard";
    } else if (location === "/budget-tracker") {
      return "budget-tracker";
    } else if (location === "/recipients") {
      return "recipients";
    } else if (location === "/recommendations") {
      return "recommendations";
    }
    return "dashboard";
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
        <FullNav activeTab={determineActiveTab()} onLogout={handleLogout} />
        
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
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Your Recipients</h1>
                <p className="text-gray-600">Manage your gift recipients and their preferences.</p>
                
                {/* Recipients list */}
                <div className="flex justify-end">
                  <button 
                    className="bg-pink-500 text-white px-4 py-2 rounded-md flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Recipient
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
                    <div className="h-40 bg-gray-100">
                      <img 
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=150&q=80" 
                        alt="Emma Thompson" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">Emma Thompson</h3>
                      <p className="text-sm text-gray-500">Friend</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs font-medium">Reading</span>
                        <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs font-medium">Hiking</span>
                        <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs font-medium">Technology</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                    <div className="h-48 bg-gray-100">
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
                    <div className="h-48 bg-gray-100">
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
                    <div className="h-48 bg-gray-100">
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
              <button className="rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50">
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
      
      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="h-8 w-8 text-pink-400" />
              <span className="text-3xl font-bold text-white">GIFT AI</span>
            </div>
            <p className="text-gray-400">© 2025 GIFT AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;