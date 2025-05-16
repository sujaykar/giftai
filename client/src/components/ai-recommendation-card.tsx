import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatPrice } from "@/lib/utils";
import { Gift, Heart, Share2, ExternalLink, Sparkles, Check, Star } from "lucide-react";

interface AIRecommendationCardProps {
  recommendation: {
    id: number;
    productId: number;
    reasonText: string;
    reasoning: string;
    relationshipContext: string;
    mood?: string;
    recommendationScore: string;
    product: {
      name: string;
      description: string;
      price: string;
      imageUrl?: string;
      purchaseUrl?: string;
    };
  };
  onSave?: () => void;
}

export function AIRecommendationCard({
  recommendation,
  onSave
}: AIRecommendationCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const handleSave = () => {
    setSaved(true);
    if (onSave) {
      onSave();
    }
  };
  
  // Format price to handle string or number
  const price = recommendation.product.price 
    ? formatPrice(parseFloat(recommendation.product.price))
    : "Price unavailable";
  
  // Calculate score as a percentage for easier reading
  const score = recommendation.recommendationScore 
    ? Math.round(parseFloat(recommendation.recommendationScore) * 100)
    : 90;
  
  return (
    <>
      <Card className="overflow-hidden h-full flex flex-col transition-all hover:shadow-md bg-white">
        <div className="relative aspect-video bg-gray-100">
          {recommendation.product.imageUrl ? (
            <img 
              src={recommendation.product.imageUrl} 
              alt={recommendation.product.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <Gift className="h-12 w-12" />
            </div>
          )}
          
          {/* AI badge */}
          <div className="absolute top-2 left-2">
            <Badge 
              variant="secondary" 
              className="flex items-center gap-1 bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
            >
              <Sparkles className="h-3 w-3" />
              AI Generated
            </Badge>
          </div>
          
          {/* Match score */}
          <div className="absolute top-2 right-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    variant="secondary" 
                    className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-200"
                  >
                    <Star className="h-3 w-3 fill-green-800" />
                    {score}% Match
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Based on recipient preferences and your relationship</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-medium line-clamp-2">
              {recommendation.product.name}
            </CardTitle>
            <span className="font-semibold text-sm">{price}</span>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-0 pb-2 flex-grow">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className="bg-indigo-50">
              {recommendation.relationshipContext}
            </Badge>
            
            {recommendation.mood && (
              <Badge variant="outline" className="bg-pink-50">
                {recommendation.mood}
              </Badge>
            )}
          </div>
          
          <CardDescription className="line-clamp-3 text-sm">
            {recommendation.reasonText || "Perfect gift based on your relationship"}
          </CardDescription>
        </CardContent>
        
        <CardFooter className="p-4 pt-2 flex justify-between">
          <Button 
            variant="link" 
            size="sm"
            className="p-0 h-auto text-indigo-600 hover:text-indigo-800"
            onClick={() => setDetailsOpen(true)}
          >
            View Details
          </Button>
          
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => {
                // This would open a share dialog in a real app
                navigator.clipboard.writeText(
                  `Check out this gift idea: ${recommendation.product.name}`
                );
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className={`h-8 w-8 rounded-full ${saved ? 'text-red-500' : ''}`}
              onClick={handleSave}
            >
              <Heart className={`h-4 w-4 ${saved ? 'fill-red-500' : ''}`} />
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{recommendation.product.name}</DialogTitle>
            <DialogDescription>AI-Powered Gift Recommendation</DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative aspect-square bg-gray-100 rounded-md overflow-hidden">
              {recommendation.product.imageUrl ? (
                <img 
                  src={recommendation.product.imageUrl} 
                  alt={recommendation.product.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <Gift className="h-24 w-24" />
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Price</h3>
                <p className="text-lg font-bold">{price}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Why It's a Great Match</h3>
                <p className="text-gray-700 text-sm mt-1">
                  {recommendation.reasoning || recommendation.reasonText}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-indigo-50 text-indigo-800">
                  {recommendation.relationshipContext}
                </Badge>
                
                {recommendation.mood && (
                  <Badge variant="outline" className="bg-pink-50 text-pink-800">
                    {recommendation.mood}
                  </Badge>
                )}
                
                <Badge variant="outline" className="bg-green-50 text-green-800">
                  {score}% Match Score
                </Badge>
              </div>
              
              <div className="pt-2">
                {recommendation.product.purchaseUrl ? (
                  <Button 
                    className="w-full"
                    onClick={() => window.open(recommendation.product.purchaseUrl, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Purchase This Gift
                  </Button>
                ) : (
                  <Button 
                    className="w-full"
                    onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(recommendation.product.name)}`, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Find Where to Buy
                  </Button>
                )}
              </div>
              
              <Button 
                variant="outline" 
                className={`w-full ${saved ? 'bg-red-50 border-red-200 text-red-700' : ''}`}
                onClick={handleSave}
              >
                {saved ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Saved to Favorites
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 h-4 w-4" />
                    Save to Favorites
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="mt-2">
            <h3 className="font-medium text-gray-900">Description</h3>
            <p className="text-gray-700 text-sm mt-1">
              {recommendation.product.description || "No description available."}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}