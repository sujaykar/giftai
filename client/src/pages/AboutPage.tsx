import { Sparkles } from "lucide-react";

export function AboutPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About GIFT AI</h1>
          
          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-6">
                At GIFT AI, we believe that finding the perfect gift should be effortless and meaningful. 
                Our AI-powered platform learns about your loved ones and recommends thoughtful gifts that 
                show you truly care, taking the guesswork out of gift-giving.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Help</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  • <strong>Personalized Recommendations:</strong> Our AI analyzes recipient preferences, 
                  interests, and past gifts to suggest the perfect presents.
                </p>
                <p>
                  • <strong>Occasion Management:</strong> Never miss an important date with our intelligent 
                  reminder system for birthdays, anniversaries, and special occasions.
                </p>
                <p>
                  • <strong>Budget-Friendly Options:</strong> Find great gifts within your budget with 
                  smart filtering and price comparisons.
                </p>
                <p>
                  • <strong>Learning Platform:</strong> The more you use GIFT AI, the better it becomes 
                  at understanding your gift-giving style and preferences.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded with the vision of making gift-giving more meaningful and less stressful, 
                GIFT AI combines advanced artificial intelligence with deep understanding of human 
                relationships. We're passionate about helping people express their love and appreciation 
                through thoughtful gifts.
              </p>
              <p className="text-gray-600">
                Whether you're shopping for family, friends, colleagues, or that special someone, 
                GIFT AI is here to make every gift-giving occasion memorable and stress-free.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}