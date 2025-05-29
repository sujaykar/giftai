import { Sparkles, Search, Gift, Users, Calendar } from "lucide-react";

export function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-pink-500" />
            <span className="text-2xl font-bold text-pink-500">GIFT AI</span>
          </div>
          <a 
            href="/"
            className="text-gray-600 hover:text-pink-500 font-medium transition-colors"
          >
            Back to Home
          </a>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Help Center</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Gift className="h-8 w-8 text-pink-500" />
                <h2 className="text-2xl font-semibold text-gray-900">Getting Started</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">1. Create Your Account</h3>
                  <p className="text-gray-600 text-sm">
                    Sign up with your email or Google account to start using GIFT AI.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">2. Add Recipients</h3>
                  <p className="text-gray-600 text-sm">
                    Tell us about the people you're shopping for - their interests, age, and preferences.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">3. Get Recommendations</h3>
                  <p className="text-gray-600 text-sm">
                    Our AI will suggest personalized gifts based on the recipient information you provide.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Search className="h-8 w-8 text-pink-500" />
                <h2 className="text-2xl font-semibold text-gray-900">How It Works</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">AI Learning</h3>
                  <p className="text-gray-600 text-sm">
                    The more you use GIFT AI, the better it becomes at understanding your preferences.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Personalization</h3>
                  <p className="text-gray-600 text-sm">
                    Every recommendation is tailored to the specific recipient and occasion.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Budget Filtering</h3>
                  <p className="text-gray-600 text-sm">
                    Set your budget and we'll find the best gifts within your price range.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-8 w-8 text-pink-500" />
                <h2 className="text-2xl font-semibold text-gray-900">Managing Recipients</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Adding Details</h3>
                  <p className="text-gray-600 text-sm">
                    Include hobbies, favorite brands, colors, and any other preferences.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Updating Information</h3>
                  <p className="text-gray-600 text-sm">
                    Keep recipient profiles updated as their interests change.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Privacy</h3>
                  <p className="text-gray-600 text-sm">
                    All recipient information is kept private and secure.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-8 w-8 text-pink-500" />
                <h2 className="text-2xl font-semibold text-gray-900">Occasions & Reminders</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Setting Reminders</h3>
                  <p className="text-gray-600 text-sm">
                    Never miss important dates with our intelligent reminder system.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Recurring Events</h3>
                  <p className="text-gray-600 text-sm">
                    Set up annual reminders for birthdays, anniversaries, and holidays.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Early Planning</h3>
                  <p className="text-gray-600 text-sm">
                    Get recommendations well before special occasions to avoid last-minute stress.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-pink-50 rounded-lg p-8 mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need More Help?</h2>
            <p className="text-gray-600 mb-4">
              If you can't find the answer you're looking for, our support team is here to help.
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-pink-500 text-white px-6 py-3 rounded-md font-medium hover:bg-pink-600 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}