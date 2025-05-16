import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIRelationshipRecommendation } from "./ai-relationship-recommendation";
import { AIRecommendationCard } from "./ai-recommendation-card";
import { Loader2, Sparkles, Filter, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface HybridRecommendationSystemProps {
  userId: number;
}

export function HybridRecommendationSystem({ userId }: HybridRecommendationSystemProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("ai");
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [hybridRecommendations, setHybridRecommendations] = useState<any[]>([]);
  const [isLoadingHybrid, setIsLoadingHybrid] = useState(false);
  
  // Fetch recipients for the user
  const { data: recipients, isLoading: isLoadingRecipients } = useQuery({
    queryKey: ['/api/recipients'],
  });
  
  // Generate hybrid recommendations (combines AI, content-based, and collaborative filtering)
  const generateHybridRecommendations = async (recipientId: number) => {
    try {
      setIsLoadingHybrid(true);
      
      const response = await apiRequest<{ recommendations: any[] }>("/api/hybrid-recommendations", {
        method: "POST",
        body: JSON.stringify({
          userId,
          recipientId,
          includeAI: true,
          includeCollaborative: true, 
          includeContentBased: true,
          limit: 12
        })
      });
      
      if (response.recommendations && response.recommendations.length > 0) {
        setHybridRecommendations(response.recommendations);
        toast({
          title: "Recommendations loaded",
          description: `${response.recommendations.length} gift ideas found using our hybrid system`,
        });
      } else {
        toast({
          title: "No recommendations found",
          description: "Try selecting a different recipient or adjusting filters",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error generating hybrid recommendations:", error);
      toast({
        title: "Failed to load recommendations",
        description: "An error occurred. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingHybrid(false);
    }
  };
  
  // Handle AI recommendations generated from the AI component
  const handleAIRecommendationsGenerated = (recommendations: any[]) => {
    setAiRecommendations(recommendations);
    setActiveTab("ai-results");
  };
  
  // If no recipients are available, show a message
  if (!isLoadingRecipients && (!recipients || recipients.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-lg shadow-sm">
        <ShoppingBag className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Add Recipients First</h3>
        <p className="text-gray-500 max-w-md mb-6">
          To get personalized gift recommendations, you need to add recipients first.
          Add information about the people you want to buy gifts for.
        </p>
        <Button 
          onClick={() => window.location.href = "/recipients/new"}
          className="flex items-center gap-2"
        >
          Add Your First Recipient
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <Tabs defaultValue="ai" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">AI Powered</span>
            <span className="sm:hidden">AI</span>
          </TabsTrigger>
          <TabsTrigger value="ai-results" disabled={aiRecommendations.length === 0}>
            AI Results
          </TabsTrigger>
          <TabsTrigger value="hybrid" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Hybrid System</span>
            <span className="sm:hidden">Hybrid</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ai" className="mt-6">
          {isLoadingRecipients ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <AIRelationshipRecommendation 
              userId={userId}
              recipients={recipients || []}
              onRecommendationsGenerated={handleAIRecommendationsGenerated}
            />
          )}
        </TabsContent>
        
        <TabsContent value="ai-results" className="mt-6">
          {aiRecommendations.length > 0 ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-500" />
                  AI-Generated Gift Ideas
                </h3>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("ai")}
                >
                  New AI Search
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiRecommendations.map((recommendation, index) => (
                  <AIRecommendationCard 
                    key={index} 
                    recommendation={recommendation}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500">
                No AI recommendations available. Generate recommendations first.
              </p>
              <Button 
                variant="link"
                onClick={() => setActiveTab("ai")}
              >
                Go to AI Recommendation
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="hybrid" className="mt-6">
          {isLoadingRecipients ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-4">Hybrid Recommendation System</h3>
                <p className="text-gray-600 mb-4">
                  Our hybrid system combines three powerful recommendation methods: AI-generated recommendations,
                  content-based filtering based on recipient preferences, and collaborative filtering based on similar users.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {/* Recipient selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Select a Recipient</label>
                    <select 
                      className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                      onChange={(e) => generateHybridRecommendations(parseInt(e.target.value))}
                      defaultValue=""
                    >
                      <option value="" disabled>Select a recipient</option>
                      {recipients?.map((recipient) => (
                        <option key={recipient.id} value={recipient.id}>
                          {recipient.name} ({recipient.relationship})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <Button 
                  onClick={() => {
                    const select = document.querySelector('select') as HTMLSelectElement;
                    if (select && select.value) {
                      generateHybridRecommendations(parseInt(select.value));
                    } else {
                      toast({
                        title: "No recipient selected",
                        description: "Please select a recipient first",
                        variant: "destructive"
                      });
                    }
                  }}
                  disabled={isLoadingHybrid}
                  className="w-full md:w-auto"
                >
                  {isLoadingHybrid ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading Recommendations...
                    </>
                  ) : (
                    "Get Recommendations"
                  )}
                </Button>
              </div>
              
              {/* Hybrid Recommendations Results */}
              {hybridRecommendations.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">
                    Hybrid Recommendation Results
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hybridRecommendations.map((recommendation, index) => (
                      <AIRecommendationCard 
                        key={index} 
                        recommendation={recommendation}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}