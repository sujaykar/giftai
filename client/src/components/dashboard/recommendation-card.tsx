import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { formatPrice } from "@/lib/utils";

interface RecommendationCardProps {
  recommendation: any;
  showRecipient?: boolean;
}

export default function RecommendationCard({ recommendation, showRecipient = true }: RecommendationCardProps) {
  const product = recommendation.product;
  
  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => 
      apiRequest("PUT", `/api/recommendations/${recommendation.id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations'] });
      queryClient.invalidateQueries({ queryKey: [`/api/recipients/${recommendation.recipientId}/recommendations`] });
    }
  });

  const handleSave = () => {
    updateStatusMutation.mutate("approved");
  };

  const handleDismiss = () => {
    updateStatusMutation.mutate("dismissed");
  };

  // If recommendation is already dismissed, don't render the card
  if (recommendation.status === "dismissed") {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <img 
        src={product.imageUrl} 
        alt={product.name} 
        className="w-full h-48 object-cover" 
      />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {showRecipient && (
            <span className="text-xs px-2 py-1 rounded-full bg-primary-50 text-primary-700">
              For: {recommendation.recipientName}
            </span>
          )}
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
            {formatPrice(product.price, product.currency)}
          </span>
          {recommendation.status === "approved" && (
            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
              Purchased
            </span>
          )}
        </div>
        <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{product.description}</p>
        
        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <div className="flex items-start gap-2">
            <i className="ri-lightbulb-line text-amber-500 mt-0.5"></i>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Why we recommend this:</span> {recommendation.reasoning}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <a 
            href={product.sourceUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex-1 inline-flex justify-center items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90"
          >
            Buy Now
            <i className="ri-external-link-line ml-1"></i>
          </a>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleSave}
            disabled={recommendation.status === "approved" || updateStatusMutation.isPending}
            className={recommendation.status === "approved" ? "bg-green-50 border-green-200 text-green-600" : ""}
          >
            <i className={`${recommendation.status === "approved" ? "ri-check-line" : "ri-bookmark-line"}`}></i>
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleDismiss}
            disabled={recommendation.status === "approved" || updateStatusMutation.isPending}
          >
            <i className="ri-close-line"></i>
          </Button>
        </div>
      </div>
    </div>
  );
}
