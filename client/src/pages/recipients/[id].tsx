import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import RecipientDetail from "@/components/recipients/recipient-detail";
import RecommendationCard from "@/components/dashboard/recommendation-card";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface RecipientDetailPageProps {
  id: string;
}

export default function RecipientDetailPage({ id }: RecipientDetailPageProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Fetch recipient details
  const { data: recipient, isLoading: recipientLoading } = useQuery({
    queryKey: [`/api/recipients/${id}`],
  });

  // Fetch recipient's preferences
  const { data: preferences, isLoading: preferencesLoading } = useQuery({
    queryKey: [`/api/recipients/${id}/preferences`],
    enabled: !!recipient
  });

  // Fetch recipient's occasions
  const { data: occasions, isLoading: occasionsLoading } = useQuery({
    queryKey: [`/api/recipients/${id}/occasions`],
    enabled: !!recipient
  });

  // Fetch recipient's recommendations
  const { data: recommendations, isLoading: recommendationsLoading } = useQuery({
    queryKey: [`/api/recipients/${id}/recommendations`],
    enabled: !!recipient
  });

  // Generate new recommendations mutation
  const generateMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/recipients/${id}/recommendations/generate`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/recipients/${id}/recommendations`] });
      toast({
        title: "Recommendations generated",
        description: "New gift recommendations have been created based on preferences.",
      });
    },
    onError: (error) => {
      console.error("Error generating recommendations:", error);
      toast({
        title: "Failed to generate recommendations",
        description: "There was a problem creating new recommendations. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete recipient mutation
  const deleteMutation = useMutation({
    mutationFn: () => apiRequest("DELETE", `/api/recipients/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recipients'] });
      toast({
        title: "Recipient deleted",
        description: "The recipient has been removed from your list.",
      });
      navigate("/recipients");
    },
    onError: (error) => {
      console.error("Error deleting recipient:", error);
      toast({
        title: "Failed to delete recipient",
        description: "There was a problem deleting this recipient. Please try again.",
        variant: "destructive",
      });
    }
  });

  if (recipientLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 w-40 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded mb-8"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-gray-200 mb-3"></div>
                  <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="h-6 w-48 bg-gray-200 rounded mb-6"></div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="h-64 bg-gray-200 rounded"></div>
                  <div className="h-64 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!recipient) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-lg mx-auto">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <i className="ri-error-warning-line text-2xl text-gray-400"></i>
          </div>
          <h2 className="text-xl font-bold mb-2">Recipient not found</h2>
          <p className="text-gray-600 mb-6">The recipient you're looking for doesn't exist or has been removed.</p>
          <Link href="/recipients">
            <Button>
              <i className="ri-arrow-left-line mr-2"></i>
              Back to Recipients
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/recipients">
          <a className="inline-flex items-center text-sm text-gray-600 hover:text-primary-500">
            <i className="ri-arrow-left-line mr-1"></i>
            Back to recipients
          </a>
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4">
          <h1 className="font-heading text-2xl md:text-3xl font-bold">{recipient.name}</h1>
          <div className="flex gap-3 mt-3 md:mt-0">
            <Button variant="outline" onClick={() => navigate(`/recipients/${id}/edit`)}>
              <i className="ri-edit-line mr-1"></i>
              Edit Profile
            </Button>
            <Button onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending}>
              <i className="ri-gift-line mr-1"></i>
              {generateMutation.isPending ? "Generating..." : "Find New Gifts"}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recipient Details Column */}
        <div className="lg:col-span-1">
          <RecipientDetail
            recipient={recipient}
            preferences={preferences || []}
            occasions={occasions || []}
            isLoading={{
              preferences: preferencesLoading,
              occasions: occasionsLoading
            }}
            onDelete={() => {
              if (window.confirm("Are you sure you want to delete this recipient? This action cannot be undone.")) {
                deleteMutation.mutate();
              }
            }}
          />
        </div>
        
        {/* Recommendations Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-medium text-lg">Gift Recommendations</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Filter:</span>
                  <select className="text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                    <option>All Occasions</option>
                    <option>Birthday</option>
                    <option>Anniversary</option>
                    <option>Christmas</option>
                  </select>
                  <select className="text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                    <option>All Price Ranges</option>
                    <option>Under $50</option>
                    <option>$50 - $100</option>
                    <option>$100 - $200</option>
                    <option>$200+</option>
                  </select>
                </div>
              </div>
              
              {recommendationsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden animate-pulse">
                      <div className="w-full h-48 bg-gray-200"></div>
                      <div className="p-4">
                        <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 w-3/4 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 w-full bg-gray-200 rounded mb-3"></div>
                        <div className="h-24 bg-gray-200 rounded mb-4"></div>
                        <div className="flex gap-2">
                          <div className="h-8 flex-1 bg-gray-200 rounded"></div>
                          <div className="h-8 w-8 bg-gray-200 rounded"></div>
                          <div className="h-8 w-8 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recommendations?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendations.map((recommendation) => (
                    <RecommendationCard 
                      key={recommendation.id}
                      recommendation={recommendation}
                      showRecipient={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <i className="ri-gift-line text-2xl text-gray-400"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations yet</h3>
                  <p className="text-gray-500 mb-4">Generate recommendations based on {recipient.name}'s preferences.</p>
                  <Button onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending}>
                    <i className="ri-magic-line mr-1"></i>
                    {generateMutation.isPending ? "Generating..." : "Generate recommendations"}
                  </Button>
                </div>
              )}
              
              {recommendations && recommendations.length > 4 && (
                <div className="mt-8 flex justify-center">
                  <Button variant="outline">
                    Load more recommendations
                    <i className="ri-arrow-down-line ml-1"></i>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
