import { useState } from "react";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  if (!loggedIn) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">GIFT AI</h1>
            <p className="text-gray-600">Personalized Gift Recommendations</p>
          </div>
          
          <button 
            onClick={handleLogin}
            className="w-full rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-pink-600"
          >
            Sign In (Demo Mode)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Welcome to GIFT AI</h1>
      <p className="mb-4">Your personalized gift recommendation platform</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-300 bg-white p-4 shadow">
          <h2 className="mb-2 text-xl font-semibold">Recipients</h2>
          <p className="text-gray-600">Manage your gift recipients</p>
        </div>
        
        <div className="rounded-lg border border-gray-300 bg-white p-4 shadow">
          <h2 className="mb-2 text-xl font-semibold">Recommendations</h2>
          <p className="text-gray-600">View personalized gift ideas</p>
        </div>
        
        <div className="rounded-lg border border-gray-300 bg-white p-4 shadow">
          <h2 className="mb-2 text-xl font-semibold">Upcoming Occasions</h2>
          <p className="text-gray-600">Track important dates</p>
        </div>
      </div>
    </div>
  );
}

export default App;
