import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import MainLayout from "@/components/layout/main-layout";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Recipients from "@/pages/recipients/index";
import RecipientDetail from "@/pages/recipients/[id]";
import AddRecipient from "@/pages/recipients/add";
import PreferenceQuiz from "@/pages/recipients/quiz";
import Recommendations from "@/pages/recommendations";
import { useState } from "react";

// A simpler app structure that doesn't depend on auth context directly
function App() {
  // We'll use temporary state to show login by default until auth is working properly
  const [loggedIn, setLoggedIn] = useState(false);

  // This is a temporary solution to allow us to test the app
  const handleFakeLogin = () => {
    setLoggedIn(true);
  };

  return (
    <TooltipProvider>
      <Toaster />
      
      <Switch>
        {/* Public routes */}
        <Route path="/login">
          <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-sm">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Welcome Back</h1>
                <p className="text-muted-foreground">Sign in to your account to continue</p>
              </div>
              
              <button 
                onClick={handleFakeLogin}
                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                Sign In (Demo Mode)
              </button>
              
              <div className="text-center text-sm">
                <p>Don't have an account? <a href="/register" className="text-primary hover:underline">Sign up</a></p>
              </div>
            </div>
          </div>
        </Route>
        
        <Route path="/register">
          <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-sm">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Create Account</h1>
                <p className="text-muted-foreground">Sign up for a new account</p>
              </div>
              
              <button 
                onClick={handleFakeLogin}
                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                Sign Up (Demo Mode)
              </button>
              
              <div className="text-center text-sm">
                <p>Already have an account? <a href="/login" className="text-primary hover:underline">Sign in</a></p>
              </div>
            </div>
          </div>
        </Route>
        
        {/* Protected routes */}
        <Route path="/">
          {loggedIn ? (
            <MainLayout>
              <Dashboard />
            </MainLayout>
          ) : (
            <Route path="/login" />
          )}
        </Route>
        
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </TooltipProvider>
  );
}

export default App;
