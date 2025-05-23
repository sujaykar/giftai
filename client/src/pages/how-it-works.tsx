import { useState } from "react";
import { Sparkles, ArrowRight, Users, Brain, Gift, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-pink-500" />
            <span className="text-2xl font-bold text-pink-500">GIFT AI</span>
          </div>
          <Button variant="outline" onClick={() => window.history.back()}>
            Back to Home
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-50 to-indigo-50 py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-500">GIFT AI</span> Works
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Our AI-powered platform makes gift-giving effortless by learning about your loved ones and finding perfect matches every time.
          </p>
        </div>
      </section>

      {/* Interactive Steps Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Step Navigation */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-16">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <button
                    onClick={() => setActiveStep(step)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                      activeStep === step
                        ? "bg-pink-500 text-white shadow-lg"
                        : "bg-white text-gray-400 border-2 border-gray-200 hover:border-pink-300"
                    }`}
                  >
                    {step}
                  </button>
                  {step < 4 && (
                    <ArrowRight className="h-6 w-6 text-gray-300 mx-4 hidden md:block" />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Step 1: Add Recipients */}
              {activeStep === 1 && (
                <>
                  <div className="order-2 md:order-1">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                        <Users className="h-8 w-8 text-pink-500" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">Add Your Recipients</h2>
                        <p className="text-pink-500 font-semibold">Step 1 of 4</p>
                      </div>
                    </div>
                    <p className="text-lg text-gray-600 mb-6">
                      Start by creating profiles for the people you want to find gifts for. Add family members, friends, colleagues, or anyone special in your life.
                    </p>
                    <ul className="space-y-4">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Add names and relationships</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Set age ranges and basic info</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Organize by groups or occasions</span>
                      </li>
                    </ul>
                  </div>
                  <div className="order-1 md:order-2">
                    <Card className="shadow-xl">
                      <CardContent className="p-8">
                        <div className="space-y-4">
                          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900">Mom</h4>
                            <p className="text-gray-600 text-sm">Mother • 50s • Loves gardening</p>
                          </div>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900">Alex</h4>
                            <p className="text-gray-600 text-sm">Best Friend • 20s • Tech enthusiast</p>
                          </div>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900">Sarah</h4>
                            <p className="text-gray-600 text-sm">Sister • 30s • Fashion lover</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}

              {/* Step 2: Share Preferences */}
              {activeStep === 2 && (
                <>
                  <div className="order-2 md:order-1">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <Brain className="h-8 w-8 text-blue-500" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">Share Their Preferences</h2>
                        <p className="text-blue-500 font-semibold">Step 2 of 4</p>
                      </div>
                    </div>
                    <p className="text-lg text-gray-600 mb-6">
                      Tell us about each person's interests, hobbies, style preferences, and personality. The more we know, the better our recommendations become.
                    </p>
                    <ul className="space-y-4">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Answer quick questions about their interests</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Set budget ranges for different occasions</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Note their favorite brands or styles</span>
                      </li>
                    </ul>
                  </div>
                  <div className="order-1 md:order-2">
                    <Card className="shadow-xl">
                      <CardContent className="p-8">
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold mb-3">Alex's Interests:</h4>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Technology</span>
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Gaming</span>
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Fitness</span>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-3">Budget Range:</h4>
                            <p className="text-gray-600">$50 - $150 for birthdays</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-3">Style:</h4>
                            <p className="text-gray-600">Modern, minimalist, practical</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}

              {/* Step 3: AI Analysis */}
              {activeStep === 3 && (
                <>
                  <div className="order-2 md:order-1">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                        <Brain className="h-8 w-8 text-purple-500" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">AI Analysis</h2>
                        <p className="text-purple-500 font-semibold">Step 3 of 4</p>
                      </div>
                    </div>
                    <p className="text-lg text-gray-600 mb-6">
                      Our advanced AI analyzes the preferences, personality traits, and relationship dynamics to understand what makes the perfect gift for each person.
                    </p>
                    <ul className="space-y-4">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Personality and interest matching</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Occasion and mood analysis</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Budget optimization</span>
                      </li>
                    </ul>
                  </div>
                  <div className="order-1 md:order-2">
                    <Card className="shadow-xl">
                      <CardContent className="p-8">
                        <div className="text-center">
                          <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                            <Brain className="h-12 w-12 text-white" />
                          </div>
                          <h4 className="font-semibold text-lg mb-4">AI Processing...</h4>
                          <div className="space-y-3 text-left">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                              <span className="text-sm">Analyzing personality traits</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                              <span className="text-sm">Matching with product database</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                              <span className="text-sm">Generating recommendations</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}

              {/* Step 4: Get Recommendations */}
              {activeStep === 4 && (
                <>
                  <div className="order-2 md:order-1">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <Gift className="h-8 w-8 text-green-500" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">Get Perfect Recommendations</h2>
                        <p className="text-green-500 font-semibold">Step 4 of 4</p>
                      </div>
                    </div>
                    <p className="text-lg text-gray-600 mb-6">
                      Receive personalized gift recommendations ranked by compatibility. Each suggestion includes why it's perfect for that person and where to find it.
                    </p>
                    <ul className="space-y-4">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Ranked recommendations with match scores</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Direct links to purchase</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Alternative options at different price points</span>
                      </li>
                    </ul>
                  </div>
                  <div className="order-1 md:order-2">
                    <Card className="shadow-xl">
                      <CardContent className="p-8">
                        <div className="space-y-4">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold">Wireless Earbuds Pro</h4>
                              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">95% Match</span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">Perfect for Alex's tech interests and active lifestyle</p>
                            <p className="font-semibold text-green-600">$129.99</p>
                          </div>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold">Smart Fitness Watch</h4>
                              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">87% Match</span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">Combines tech and fitness tracking</p>
                            <p className="font-semibold text-blue-600">$199.99</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose GIFT AI?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands who've transformed their gift-giving experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Save Time</h3>
              <p className="text-gray-600">Skip hours of browsing. Get perfect suggestions in minutes.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Perfect Matches</h3>
              <p className="text-gray-600">AI-powered recommendations that truly match their personality.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💝</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Thoughtful Gifts</h3>
              <p className="text-gray-600">Show you care with gifts that demonstrate real understanding.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-pink-500 to-indigo-500 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Gift-Giving?
          </h2>
          <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users who never worry about finding the perfect gift again.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-pink-500 hover:bg-gray-50 text-lg px-8 py-3"
            onClick={() => window.location.href = '/'}
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-pink-400" />
            <span className="text-xl font-bold">GIFT AI</span>
          </div>
          <p className="text-gray-400">© 2025 GIFT AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}