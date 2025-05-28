import { useState } from "react";
import { Sparkles, ArrowRight, ArrowLeft, Users, Share2, Brain, Gift, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(1);

  const nextStep = () => {
    if (activeStep < 4) setActiveStep(activeStep + 1);
  };

  const prevStep = () => {
    if (activeStep > 1) setActiveStep(activeStep - 1);
  };

  const steps = [
    {
      id: 1,
      icon: Users,
      title: "Add Your Recipients",
      subtitle: "Step 1 of 4",
      color: "pink",
      description: "Start by creating profiles for the people you want to find gifts for. Add family members, friends, colleagues, or anyone special in your life.",
      features: [
        "Add names and relationships",
        "Set age ranges and basic info", 
        "Organize by groups or occasions"
      ],
      mockup: (
        <Card className="shadow-xl bg-white">
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
      )
    },
    {
      id: 2,
      icon: Share2,
      title: "Share Their Preferences",
      subtitle: "Step 2 of 4",
      color: "blue",
      description: "Tell us about each person's interests, hobbies, style preferences, and personality. The more we know, the better our recommendations become.",
      features: [
        "Answer quick questions about their interests",
        "Set budget ranges for different occasions",
        "Note their favorite brands or styles"
      ],
      mockup: (
        <Card className="shadow-xl bg-white">
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
      )
    },
    {
      id: 3,
      icon: Brain,
      title: "AI Analysis",
      subtitle: "Step 3 of 4",
      color: "purple",
      description: "Our advanced AI analyzes the preferences, personality traits, and relationship dynamics to understand what makes the perfect gift for each person.",
      features: [
        "Personality and interest matching",
        "Occasion and mood analysis",
        "Budget optimization"
      ],
      mockup: (
        <Card className="shadow-xl bg-white">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mb-6 flex items-center justify-center">
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
      )
    },
    {
      id: 4,
      icon: Gift,
      title: "Get Perfect Recommendations",
      subtitle: "Step 4 of 4",
      color: "green",
      description: "Receive personalized gift recommendations ranked by compatibility. Each suggestion includes why it's perfect for that person and where to find it.",
      features: [
        "Ranked recommendations with match scores",
        "Direct links to purchase",
        "Alternative options at different price points"
      ],
      mockup: (
        <Card className="shadow-xl bg-white">
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
      )
    }
  ];

  const currentStep = steps[activeStep - 1];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-pink-500" />
            <span className="text-2xl font-bold text-pink-500">GIFT AI</span>
          </div>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Back to Home
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-50 to-purple-50 py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">GIFT AI</span> Works
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Our AI-powered platform makes gift-giving effortless by learning about your loved ones and finding perfect matches every time.
          </p>
        </div>
      </section>

      {/* Main Carousel Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Progress Dots */}
            <div className="flex justify-center items-center gap-2 mb-12">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <button
                    onClick={() => setActiveStep(step)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      activeStep === step ? "bg-pink-500" : "bg-gray-300"
                    }`}
                  />
                  {step < 4 && <div className="w-8 h-0.5 bg-gray-300 mx-2" />}
                </div>
              ))}
            </div>

            {/* Carousel Content */}
            <div className="relative">
              <div className="grid md:grid-cols-2 gap-16 items-center min-h-[600px]">
                {/* Left Content */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      currentStep.color === 'pink' ? 'bg-pink-100' :
                      currentStep.color === 'blue' ? 'bg-blue-100' :
                      currentStep.color === 'purple' ? 'bg-purple-100' : 'bg-green-100'
                    }`}>
                      <currentStep.icon className={`h-8 w-8 ${
                        currentStep.color === 'pink' ? 'text-pink-500' :
                        currentStep.color === 'blue' ? 'text-blue-500' :
                        currentStep.color === 'purple' ? 'text-purple-500' : 'text-green-500'
                      }`} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">{currentStep.title}</h2>
                      <p className={`font-semibold ${
                        currentStep.color === 'pink' ? 'text-pink-500' :
                        currentStep.color === 'blue' ? 'text-blue-500' :
                        currentStep.color === 'purple' ? 'text-purple-500' : 'text-green-500'
                      }`}>{currentStep.subtitle}</p>
                    </div>
                  </div>
                  
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {currentStep.description}
                  </p>
                  
                  <ul className="space-y-4">
                    {currentStep.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Mockup */}
                <div className="flex justify-center">
                  {currentStep.mockup}
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevStep}
                disabled={activeStep === 1}
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeStep === 1 
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                    : "bg-white text-pink-500 hover:bg-pink-50 shadow-lg hover:shadow-xl"
                }`}
              >
                <ArrowLeft className="h-6 w-6" />
              </button>

              <button
                onClick={nextStep}
                disabled={activeStep === 4}
                className={`absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeStep === 4 
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                    : "bg-white text-pink-500 hover:bg-pink-50 shadow-lg hover:shadow-xl"
                }`}
              >
                <ArrowRight className="h-6 w-6" />
              </button>
            </div>

            {/* Step Number Indicators */}
            <div className="flex justify-center mt-12 gap-4">
              {[1, 2, 3, 4].map((step) => (
                <button
                  key={step}
                  onClick={() => setActiveStep(step)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                    activeStep === step
                      ? "bg-pink-500 text-white shadow-lg"
                      : "bg-white text-gray-400 border-2 border-gray-200 hover:border-pink-300"
                  }`}
                >
                  {step}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-500 py-16">
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
    </div>
  );
}