import { ArrowLeft, Sparkles, Gift, ThumbsUp, BrainCircuit } from "lucide-react";
import { useLocation } from "wouter";

export default function HowItWorks() {
  const [_, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-b from-pink-50 to-white pt-16 pb-24">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <button
              onClick={() => navigate("/")}
              className="mb-8 inline-flex items-center gap-2 text-pink-500 hover:text-pink-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </button>
            <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              How <span className="text-pink-500">GIFT AI</span> Works
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Our intelligent gift recommendation platform combines AI-powered analysis, personalization, and 
              multi-source product matching to help you find the perfect gifts for your loved ones.
            </p>
          </div>
        </div>
      </header>

      {/* Process steps */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
            {/* Step 1 */}
            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Create Recipient Profiles</h3>
              <p className="text-gray-600">
                Start by adding your gift recipients and complete a quick preference quiz about their interests, 
                personality traits, and gift preferences. The more details you provide, the better our recommendations will be.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">AI Analyzes Preferences</h3>
              <p className="text-gray-600">
                Our advanced AI engine processes recipient data to understand their unique preferences. We combine this 
                with demographic trends and similar user patterns to build a comprehensive interest profile.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Generate Tailored Recommendations</h3>
              <p className="text-gray-600">
                Based on the recipient's profile, our hybrid recommendation system suggests personalized gift ideas
                that match their interests, your relationship dynamics, and occasion context. Filter by price range, 
                mood, and categories.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                <span className="text-xl font-bold">4</span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Find The Perfect Gift</h3>
              <p className="text-gray-600">
                Browse through personalized recommendations, compare prices across multiple retailers, and track your gift 
                budget. Save favorite ideas for later and get reminders for upcoming occasions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features highlight */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Key Features
          </h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-pink-100 p-4">
                <BrainCircuit className="h-8 w-8 text-pink-500" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Hybrid AI Recommendations</h3>
              <p className="text-gray-600">
                Our system combines AI-powered relationship analysis, content-based matching, and collaborative 
                filtering to suggest gifts that truly resonate.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-pink-100 p-4">
                <Gift className="h-8 w-8 text-pink-500" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Relationship-Based Gifts</h3>
              <p className="text-gray-600">
                Get special gift recommendations based on your relationship context, complete with explanations of 
                why each gift is meaningful for your connection.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-pink-100 p-4">
                <ThumbsUp className="h-8 w-8 text-pink-500" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Continuous Improvement</h3>
              <p className="text-gray-600">
                The more you use GIFT AI, the smarter it gets. Our system learns from your feedback to provide 
                increasingly accurate and personalized recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-pink-600 py-16 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="mb-6 text-3xl font-bold">Ready to find the perfect gifts?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-pink-100">
            Join thousands of users who have revolutionized their gift-giving experience with GIFT AI.
          </p>
          <button
            onClick={() => navigate("/")}
            className="rounded-md bg-white px-6 py-3 font-medium text-pink-600 shadow-md hover:bg-pink-50"
          >
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
}