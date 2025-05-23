import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, ThumbsDown, Eye, Share2, ShoppingCart, Clock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface SmartRecommendationCardProps {
  recommendation: any;
  recipientId: number;
  onFeedback?: (feedback: any) => void;
}

export function SmartRecommendationCard({ 
  recommendation, 
  recipientId, 
  onFeedback 
}: SmartRecommendationCardProps) {
  const [viewStartTime] = useState(Date.now());
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackReasons, setFeedbackReasons] = useState<string[]>([]);
  const [alternativePreferences, setAlternativePreferences] = useState("");
  
  const queryClient = useQueryClient();

  // Record feedback mutation
  const recordFeedbackMutation = useMutation({
    mutationFn: (feedbackData: any) => apiRequest("/api/feedback/record", {
      method: "POST",
      body: JSON.stringify(feedbackData)
    }),
    onSuccess: (data) => {
      // Invalidate recommendations to get updated ones
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
      onFeedback?.(data);
    }
  });

  const handleFeedback = async (feedbackType: string, showDialog = false) => {
    const timeSpent = Math.floor((Date.now() - viewStartTime) / 1000);
    
    const feedbackData = {
      productId: recommendation.productId,
      recipientId,
      recommendationId: recommendation.id,
      feedbackType,
      timeSpent,
      sessionId: sessionStorage.getItem("sessionId") || undefined
    };

    if (showDialog && feedbackType === "dislike") {
      setShowFeedbackDialog(true);
      return;
    }

    await recordFeedbackMutation.mutateAsync(feedbackData);
  };

  const handleDetailedFeedback = async () => {
    const timeSpent = Math.floor((Date.now() - viewStartTime) / 1000);
    
    const feedbackData = {
      productId: recommendation.productId,
      recipientId,
      recommendationId: recommendation.id,
      feedbackType: "dislike",
      timeSpent,
      reasons: feedbackReasons,
      alternativePreferences: alternativePreferences ? { note: alternativePreferences } : undefined,
      sessionId: sessionStorage.getItem("sessionId") || undefined
    };

    await recordFeedbackMutation.mutateAsync(feedbackData);
    setShowFeedbackDialog(false);
    setFeedbackReasons([]);
    setAlternativePreferences("");
  };

  const reasonOptions = [
    "too_expensive",
    "not_their_style", 
    "already_have_similar",
    "wrong_age_group",
    "not_practical",
    "poor_quality",
    "inappropriate_occasion",
    "not_interesting",
    "prefer_different_brand"
  ];

  const reasonLabels = {
    "too_expensive": "Too expensive",
    "not_their_style": "Not their style",
    "already_have_similar": "They already have something similar",
    "wrong_age_group": "Wrong age group",
    "not_practical": "Not practical enough",
    "poor_quality": "Appears to be poor quality",
    "inappropriate_occasion": "Not appropriate for this occasion",
    "not_interesting": "Not interesting to them",
    "prefer_different_brand": "Prefer a different brand"
  };

  return (
    <>
      <Card className="w-full max-w-sm hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{recommendation.product?.name}</CardTitle>
            {recommendation.adjustedScore && (
              <Badge variant="secondary" className="text-xs">
                AI: {Math.round(recommendation.adjustedScore * 100)}%
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Product Image */}
          {recommendation.product?.imageUrl && (
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={recommendation.product.imageUrl} 
                alt={recommendation.product.name}
                className="w-full h-full object-cover"
                onLoad={() => handleFeedback("view")}
              />
            </div>
          )}

          {/* Product Details */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600 line-clamp-2">
              {recommendation.product?.description}
            </p>
            
            {recommendation.product?.price && (
              <p className="text-lg font-bold text-green-600">
                ${recommendation.product.price} {recommendation.product?.currency}
              </p>
            )}

            {/* AI Classification Insights */}
            {recommendation.product?.classification && (
              <div className="flex flex-wrap gap-1">
                {recommendation.product.classification.giftabilityScore > 0.8 && (
                  <Badge variant="outline" className="text-xs">Perfect Gift</Badge>
                )}
                {recommendation.product.classification.uniquenessScore > 0.7 && (
                  <Badge variant="outline" className="text-xs">Unique</Badge>
                )}
                {recommendation.product.classification.practicalityScore > 0.8 && (
                  <Badge variant="outline" className="text-xs">Practical</Badge>
                )}
              </div>
            )}

            {/* Learning Indicators */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {recommendation.feedbackInfluence && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Learning from your preferences</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-2">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleFeedback("like")}
                disabled={recordFeedbackMutation.isPending}
                className="flex items-center gap-1"
              >
                <Heart className="w-4 h-4" />
                Like
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleFeedback("dislike", true)}
                disabled={recordFeedbackMutation.isPending}
                className="flex items-center gap-1"
              >
                <ThumbsDown className="w-4 h-4" />
                Pass
              </Button>
            </div>

            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleFeedback("share")}
                disabled={recordFeedbackMutation.isPending}
              >
                <Share2 className="w-4 h-4" />
              </Button>
              
              {recommendation.product?.purchaseUrl && (
                <Button
                  size="sm"
                  onClick={() => {
                    handleFeedback("click");
                    window.open(recommendation.product.purchaseUrl, "_blank");
                  }}
                  className="flex items-center gap-1"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Buy
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Help us learn your preferences</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Why isn't this a good match? Your feedback helps us recommend better gifts!
            </p>

            <div className="space-y-3">
              <label className="text-sm font-medium">Reasons (select all that apply):</label>
              <div className="grid grid-cols-1 gap-2">
                {reasonOptions.map((reason) => (
                  <div key={reason} className="flex items-center space-x-2">
                    <Checkbox
                      id={reason}
                      checked={feedbackReasons.includes(reason)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFeedbackReasons([...feedbackReasons, reason]);
                        } else {
                          setFeedbackReasons(feedbackReasons.filter(r => r !== reason));
                        }
                      }}
                    />
                    <label htmlFor={reason} className="text-sm cursor-pointer">
                      {reasonLabels[reason]}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">What would they prefer instead?</label>
              <Textarea
                placeholder="Tell us what type of gift would be better..."
                value={alternativePreferences}
                onChange={(e) => setAlternativePreferences(e.target.value)}
                className="min-h-20"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowFeedbackDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleDetailedFeedback}
                disabled={recordFeedbackMutation.isPending}
              >
                Submit Feedback
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}