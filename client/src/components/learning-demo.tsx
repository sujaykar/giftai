import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, TrendingUp, Users, Target, Zap } from "lucide-react";

export function LearningAlgorithmDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const learningSteps = [
    {
      title: "Initial State",
      description: "User gets basic recommendations",
      data: {
        recommendations: [
          { name: "Generic Watch", score: 0.6, reason: "Popular item" },
          { name: "Standard Wallet", score: 0.5, reason: "Common gift" },
          { name: "Basic Headphones", score: 0.7, reason: "Tech category" }
        ],
        userPreferences: {},
        similarities: []
      }
    },
    {
      title: "User Feedback #1",
      description: "User dislikes expensive items",
      feedback: { type: "dislike", reason: "too_expensive", product: "Luxury Watch ($500)" },
      data: {
        recommendations: [
          { name: "Affordable Watch", score: 0.8, reason: "Budget-friendly + learned preference" },
          { name: "DIY Craft Kit", score: 0.7, reason: "Creative + budget match" },
          { name: "Basic Headphones", score: 0.6, reason: "Tech category - price adjusted" }
        ],
        userPreferences: { priceRange: "budget", maxPrice: 100 },
        similarities: []
      }
    },
    {
      title: "User Feedback #2", 
      description: "User likes handmade/artistic items",
      feedback: { type: "like", product: "Handmade Pottery" },
      data: {
        recommendations: [
          { name: "Artisan Jewelry", score: 0.9, reason: "Handmade + artistic + budget" },
          { name: "Custom Portrait", score: 0.85, reason: "Artistic + personal + learned style" },
          { name: "DIY Craft Kit", score: 0.8, reason: "Creative match + price fit" }
        ],
        userPreferences: { 
          priceRange: "budget", 
          maxPrice: 100,
          style: "handmade_artistic",
          categories: ["art", "crafts"]
        },
        similarities: [
          { user: "ArtLover123", similarity: 0.8, reason: "Both like handmade items" }
        ]
      }
    },
    {
      title: "Advanced Learning",
      description: "System finds similar users and collaborative patterns",
      data: {
        recommendations: [
          { name: "Local Artist Print", score: 0.95, reason: "Collaborative filtering + art preference + budget" },
          { name: "Vintage Book Collection", score: 0.9, reason: "Similar users also liked + thoughtful + budget" },
          { name: "Handmade Candles", score: 0.88, reason: "Artisan match + scent preferences learned" }
        ],
        userPreferences: { 
          priceRange: "budget",
          maxPrice: 100,
          style: "handmade_artistic",
          categories: ["art", "crafts", "books"],
          personalityFit: "creative_thoughtful"
        },
        similarities: [
          { user: "ArtLover123", similarity: 0.8, reason: "Both like handmade items" },
          { user: "BookwormMom", similarity: 0.7, reason: "Similar taste in thoughtful gifts" },
          { user: "CraftDaddy", similarity: 0.75, reason: "Shared love of creative items" }
        ]
      }
    }
  ];

  const currentData = learningSteps[currentStep];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-600" />
            Learning Algorithm Demonstration
          </CardTitle>
          <p className="text-gray-600">
            See how your gift recommendation system learns and improves from user feedback
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Learning Progress</span>
                <span>{currentStep + 1}/4 steps</span>
              </div>
              <Progress value={(currentStep + 1) * 25} className="w-full" />
            </div>

            {/* Step Navigation */}
            <div className="flex gap-2 justify-center">
              {learningSteps.map((_, index) => (
                <Button
                  key={index}
                  variant={index === currentStep ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentStep(index)}
                >
                  Step {index + 1}
                </Button>
              ))}
            </div>

            {/* Current Step Display */}
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">{currentData.title}</CardTitle>
                <p className="text-gray-600">{currentData.description}</p>
                
                {currentData.feedback && (
                  <div className="mt-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium">User Feedback:</span>
                    </div>
                    <p className="text-sm mt-1">
                      {currentData.feedback.type === "like" ? "👍 Liked" : "👎 Disliked"} "{currentData.feedback.product}"
                      {currentData.feedback.reason && ` - Reason: ${currentData.feedback.reason}`}
                    </p>
                  </div>
                )}
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="recommendations">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                    <TabsTrigger value="preferences">Learned Preferences</TabsTrigger>
                    <TabsTrigger value="similarities">User Similarities</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="recommendations" className="space-y-3 mt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-4 h-4 text-green-600" />
                      <span className="font-medium">Current Recommendations</span>
                    </div>
                    {currentData.data.recommendations.map((rec, index) => (
                      <Card key={index} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{rec.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
                            </div>
                            <Badge variant="secondary">
                              {Math.round(rec.score * 100)}% match
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="preferences" className="space-y-3 mt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">What the AI Has Learned</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(currentData.data.userPreferences).map(([key, value]) => (
                        <div key={key} className="p-3 bg-gray-50 rounded-lg">
                          <div className="font-medium text-sm capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {Array.isArray(value) ? value.join(", ") : String(value)}
                          </div>
                        </div>
                      ))}
                      {Object.keys(currentData.data.userPreferences).length === 0 && (
                        <p className="text-gray-500 col-span-2 text-center py-4">
                          No preferences learned yet
                        </p>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="similarities" className="space-y-3 mt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span className="font-medium">Similar Users Found</span>
                    </div>
                    {currentData.data.similarities.length > 0 ? (
                      currentData.data.similarities.map((sim, index) => (
                        <Card key={index} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{sim.user}</h4>
                                <p className="text-sm text-gray-600 mt-1">{sim.reason}</p>
                              </div>
                              <Badge variant="outline">
                                {Math.round(sim.similarity * 100)}% similar
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No similar users found yet
                      </p>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Algorithm Explanation */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                {currentStep === 0 && (
                  <p>Initially, recommendations are based on general popularity and basic category matching.</p>
                )}
                {currentStep === 1 && (
                  <p><strong>Content-Based Learning:</strong> When a user dislikes expensive items, the system learns their price preferences and adjusts future recommendations accordingly.</p>
                )}
                {currentStep === 2 && (
                  <p><strong>Pattern Recognition:</strong> Liking handmade items teaches the system about style preferences. It starts boosting artistic, creative, and personalized products.</p>
                )}
                {currentStep === 3 && (
                  <p><strong>Collaborative Filtering:</strong> The system finds users with similar tastes and recommends items those users loved. This creates a powerful feedback loop of discovery.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}