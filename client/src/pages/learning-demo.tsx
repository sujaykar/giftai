import { useState } from "react";
import { LearningAlgorithmDemo } from "@/components/learning-demo";
import { SmartRecommendationCard } from "@/components/smart-recommendation-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, TrendingUp, Zap, Target } from "lucide-react";

export default function LearningDemoPage() {
  const [simulationStep, setSimulationStep] = useState(0);
  const [userFeedbackHistory, setUserFeedbackHistory] = useState<any[]>([]);

  // Sample products for demonstration
  const sampleProducts = [
    {
      id: 1,
      name: "Luxury Swiss Watch",
      description: "Premium timepiece with leather band",
      price: "499.99",
      currency: "USD",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300",
      category: "accessories",
      occasions: ["birthday", "anniversary"],
      moods: ["luxury", "sophisticated"],
      classification: {
        giftabilityScore: 0.85,
        luxuryScore: 0.95,
        practicalityScore: 0.7,
        uniquenessScore: 0.6,
        sentimentScore: 0.8
      }
    },
    {
      id: 2,
      name: "Handmade Pottery Bowl",
      description: "Artisan ceramic bowl, perfect for home decor",
      price: "45.00",
      currency: "USD",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300",
      category: "home_decor",
      occasions: ["housewarming", "birthday"],
      moods: ["thoughtful", "artistic"],
      classification: {
        giftabilityScore: 0.9,
        luxuryScore: 0.3,
        practicalityScore: 0.6,
        uniquenessScore: 0.95,
        sentimentScore: 0.85
      }
    },
    {
      id: 3,
      name: "Local Artist Print",
      description: "Beautiful landscape print by local artist",
      price: "75.00",
      currency: "USD",
      imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300",
      category: "art",
      occasions: ["birthday", "just_because"],
      moods: ["thoughtful", "artistic"],
      classification: {
        giftabilityScore: 0.88,
        luxuryScore: 0.4,
        practicalityScore: 0.4,
        uniquenessScore: 0.9,
        sentimentScore: 0.9
      }
    }
  ];

  const simulationSteps = [
    {
      title: "Initial State - No Learning Yet",
      description: "User sees basic recommendations without personalization",
      recommendations: [
        { ...sampleProducts[0], score: 0.6, reasoning: "Popular item in accessories category" },
        { ...sampleProducts[1], score: 0.5, reasoning: "General home decor recommendation" },
        { ...sampleProducts[2], score: 0.55, reasoning: "Art category match" }
      ],
      learningInsights: {
        pricePreference: "Unknown",
        stylePreference: "Unknown",
        personalityFit: "Unknown",
        similarUsers: 0
      }
    },
    {
      title: "After User Rejects Expensive Item",
      description: "User dislikes luxury watch - 'too expensive'",
      userAction: { type: "dislike", product: "Luxury Swiss Watch", reason: "too_expensive" },
      recommendations: [
        { ...sampleProducts[1], score: 0.85, reasoning: "Budget-friendly + learned price preference" },
        { ...sampleProducts[2], score: 0.8, reasoning: "Moderate price + artistic appeal" },
        { ...sampleProducts[0], score: 0.2, reasoning: "Luxury item - penalized due to feedback" }
      ],
      learningInsights: {
        pricePreference: "Budget-conscious (under $100)",
        stylePreference: "Unknown",
        personalityFit: "Practical",
        similarUsers: 0
      }
    },
    {
      title: "After User Likes Artistic Item",
      description: "User likes handmade pottery - discovers artistic preference",
      userAction: { type: "like", product: "Handmade Pottery Bowl" },
      recommendations: [
        { ...sampleProducts[2], score: 0.95, reasoning: "Artistic + budget + learned style preference" },
        { ...sampleProducts[1], score: 0.9, reasoning: "Handmade + artistic match + liked previously" },
        { ...sampleProducts[0], score: 0.15, reasoning: "Luxury + mass-produced - poor fit" }
      ],
      learningInsights: {
        pricePreference: "Budget-conscious (under $100)",
        stylePreference: "Artistic, handmade items",
        personalityFit: "Creative, thoughtful",
        similarUsers: 3
      }
    }
  ];

  const handleSimulatedFeedback = (feedbackType: string, productId: number, reason?: string) => {
    const newFeedback = {
      type: feedbackType,
      productId,
      reason,
      timestamp: new Date(),
      step: simulationStep
    };
    
    setUserFeedbackHistory([...userFeedbackHistory, newFeedback]);
    
    // Auto-advance simulation on feedback
    if (simulationStep < simulationSteps.length - 1) {
      setTimeout(() => setSimulationStep(simulationStep + 1), 1500);
    }
  };

  const currentSimulation = simulationSteps[simulationStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <Brain className="w-10 h-10 text-blue-600" />
            Live Learning Algorithm Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Watch how your AI recommendation system learns and adapts from real user feedback in real-time
          </p>
        </div>

        {/* Simulation Controls */}
        <Card className="border-2 border-blue-200 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Live Simulation Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-center justify-center">
              <Button 
                variant="outline" 
                onClick={() => setSimulationStep(0)}
                disabled={simulationStep === 0}
              >
                Reset Demo
              </Button>
              <div className="flex gap-2">
                {simulationSteps.map((_, index) => (
                  <Button
                    key={index}
                    variant={index === simulationStep ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSimulationStep(index)}
                    className="min-w-16"
                  >
                    Step {index + 1}
                  </Button>
                ))}
              </div>
              <Badge variant="secondary" className="px-4 py-2">
                Step {simulationStep + 1} of {simulationSteps.length}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Current Simulation State */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Current Recommendations */}
          <div className="space-y-6">
            <Card className="border-2 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  {currentSimulation.title}
                </CardTitle>
                <p className="text-gray-600">{currentSimulation.description}</p>
                
                {currentSimulation.userAction && (
                  <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium">User Action:</span>
                    </div>
                    <p className="text-sm mt-1">
                      {currentSimulation.userAction.type === "like" ? "👍 Liked" : "👎 Disliked"} "{currentSimulation.userAction.product}"
                      {currentSimulation.userAction.reason && ` - Reason: ${currentSimulation.userAction.reason}`}
                    </p>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                <h3 className="font-semibold text-lg">Current Recommendations</h3>
                <div className="space-y-4">
                  {currentSimulation.recommendations.map((rec, index) => (
                    <Card key={rec.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <img 
                            src={rec.imageUrl} 
                            alt={rec.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{rec.name}</h4>
                              <Badge 
                                variant={rec.score > 0.8 ? "default" : rec.score > 0.5 ? "secondary" : "outline"}
                                className="ml-2"
                              >
                                {Math.round(rec.score * 100)}% match
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">${rec.price}</p>
                            <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                              🧠 {rec.reasoning}
                            </p>
                            
                            {/* Interactive Feedback Buttons */}
                            <div className="flex gap-2 pt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSimulatedFeedback("like", rec.id)}
                                className="text-green-600 hover:bg-green-50"
                              >
                                👍 Like
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSimulatedFeedback("dislike", rec.id, "too_expensive")}
                                className="text-red-600 hover:bg-red-50"
                              >
                                👎 Too Expensive
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSimulatedFeedback("dislike", rec.id, "not_their_style")}
                                className="text-red-600 hover:bg-red-50"
                              >
                                👎 Wrong Style
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Learning Insights */}
          <div className="space-y-6">
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  What the AI Has Learned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-sm">Price Preference</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {currentSimulation.learningInsights.pricePreference}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-sm">Style Preference</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {currentSimulation.learningInsights.stylePreference}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-sm">Personality Fit</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {currentSimulation.learningInsights.personalityFit}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-sm">Similar Users Found</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {currentSimulation.learningInsights.similarUsers} users
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feedback History */}
            <Card className="border-2 border-orange-200">
              <CardHeader>
                <CardTitle className="text-lg">Live Feedback History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {userFeedbackHistory.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      Click on recommendation buttons to see learning in action!
                    </p>
                  ) : (
                    userFeedbackHistory.map((feedback, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                        <span className="font-medium">
                          {feedback.type === "like" ? "👍" : "👎"} Step {feedback.step + 1}:
                        </span>
                        {" Product ID " + feedback.productId}
                        {feedback.reason && ` (${feedback.reason})`}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Algorithm Explanation */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-xl text-blue-800">How This Works Behind the Scenes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-700">1. Feedback Collection</h4>
                <p className="text-sm text-blue-600">
                  Every like, dislike, and detailed reason is captured and stored for learning
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-700">2. Pattern Recognition</h4>
                <p className="text-sm text-blue-600">
                  AI identifies preferences: price ranges, styles, categories, and personality fits
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-700">3. Smart Recommendations</h4>
                <p className="text-sm text-blue-600">
                  Future suggestions are automatically filtered and ranked based on learned preferences
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Algorithm Demo */}
        <LearningAlgorithmDemo />
      </div>
    </div>
  );
}