import { useState } from "react";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md space-y-6 rounded-lg border border-gray-200 bg-white p-8 shadow-lg">
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold text-pink-500">GIFT AI</h1>
            <p className="text-gray-600">Personalized Gift Recommendations</p>
          </div>
          
          <button 
            onClick={handleLogin}
            className="w-full rounded-md bg-pink-500 px-4 py-3 text-sm font-medium text-white shadow hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            Sign In (Demo Mode)
          </button>
          
          <div className="text-center text-sm">
            <p className="text-gray-500">New to GIFT AI? <span className="cursor-pointer text-pink-500 hover:underline">Create an account</span></p>
          </div>
        </div>
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
        
        {activeTab === "recipients" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Recipients</h1>
              <button className="rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600">
                Add Recipient
              </button>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Emma Thompson", age: 27, interests: "Reading, Hiking, Photography" },
                { name: "Michael Chen", age: 32, interests: "Cooking, Gaming, Travel" },
                { name: "Sarah Johnson", age: 24, interests: "Music, Art, Technology" }
              ].map((recipient, index) => (
                <div key={index} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-2 text-xl font-medium text-gray-900">{recipient.name}</div>
                  <div className="text-sm text-gray-500">Age: {recipient.age}</div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Interests:</span> {recipient.interests}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="rounded-md bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-600">
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
