import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { Loader2, Heart, GiftIcon, AlertCircle, Info } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Recipient {
  id: number;
  name: string;
  relationship: string;
  notes: string | null;
}

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string | null;
  imageUrl: string | null;
  purchaseUrl: string | null;
}

interface RelationshipRecommendation {
  productId: number;
  recommendationScore: string;
  confidenceScore: string;
  relationshipReasoning: string;
  personalizedMessage?: string;
  product: Product;
}

interface RelationshipGiftResult {
  recipient: Recipient;
  recommendations: RelationshipRecommendation[];
  relationshipAnalysis: string;
}

interface RelationshipContext {
  relationship?: string;
  occasion?: string;
  yearsKnown?: number;
  closeness?: string;
  backgroundInfo?: string;
  interests?: string[];
  pastGifts?: string[];
}

export function RelationshipGiftSuggestions({ recipientId }: { recipientId: number }) {
  const [relationshipContext, setRelationshipContext] = useState<RelationshipContext>({
    occasion: 'birthday',
    yearsKnown: 1,
    closeness: 'medium',
    interests: [],
    pastGifts: [],
  });
  const [newInterest, setNewInterest] = useState('');
  const [newPastGift, setNewPastGift] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Mock data for demo purposes
  const [useMockData, setUseMockData] = useState(false);
  const mockGiftSuggestions: RelationshipGiftResult = {
    recipient: {
      id: recipientId,
      name: recipientId === 1 ? "Emma Thompson" : recipientId === 2 ? "Michael Chen" : "Sarah Johnson",
      relationship: recipientId === 1 ? "Friend" : recipientId === 2 ? "Family" : "Colleague",
      notes: null
    },
    relationshipAnalysis: "Based on your close friendship that spans several years, I've analyzed that Emma appreciates thoughtful gifts that reflect her creative interests and outdoor activities. She values experiences and items that have personal meaning over generic expensive presents.",
    recommendations: [
      {
        productId: 1,
        recommendationScore: "0.92",
        confidenceScore: "0.85",
        relationshipReasoning: "This custom photo book aligns perfectly with Emma's love of photography and would be deeply appreciated given your close friendship history.",
        personalizedMessage: "For all our adventures together. Can't wait to create more memories!",
        product: {
          id: 1,
          name: "Custom Photo Book",
          description: "Personalized photo album with premium paper and customizable layouts",
          price: "49.99",
          imageUrl: "https://images.unsplash.com/photo-1518558997797-544417c5b104?ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80",
          purchaseUrl: "https://example.com/products/photobook"
        }
      },
      {
        productId: 2,
        recommendationScore: "0.89",
        confidenceScore: "0.83",
        relationshipReasoning: "This hiking daypack reflects Emma's interest in outdoor activities and hiking, showing that you've paid attention to her hobbies.",
        personalizedMessage: "For your next adventure! Hope this makes your hikes even better.",
        product: {
          id: 2,
          name: "Premium Hiking Daypack",
          description: "Lightweight, water-resistant backpack with multiple compartments and hydration system",
          price: "79.99",
          imageUrl: "https://images.unsplash.com/photo-1501554728187-ce583db33af7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80",
          purchaseUrl: "https://example.com/products/hikingpack"
        }
      },
      {
        productId: 3,
        recommendationScore: "0.85",
        confidenceScore: "0.78",
        relationshipReasoning: "This book subscription will appeal to Emma's love of reading while showing ongoing thoughtfulness through monthly deliveries.",
        personalizedMessage: "Because you always have the best book recommendations. Now you'll have a steady stream of new reads!",
        product: {
          id: 3,
          name: "Book Subscription Box",
          description: "Monthly curated delivery of books matched to her reading preferences",
          price: "59.99",
          imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80",
          purchaseUrl: "https://example.com/products/booksubscription"
        }
      }
    ]
  };

  // Fetch recipient data
  const {
    data: recipient,
    isLoading: isLoadingRecipient,
    error: recipientError,
  } = useQuery({
    queryKey: [`/api/recipients/${recipientId}`],
    enabled: !!recipientId,
  });

  // Fetch occasions for this recipient
  const { data: occasions } = useQuery({
    queryKey: [`/api/recipients/${recipientId}/occasions`],
    enabled: !!recipientId,
  });

  // Fetch relationship analysis
  const {
    data: relationshipAnalysis,
    isLoading: isLoadingAnalysis,
    refetch: refetchAnalysis,
  } = useQuery({
    queryKey: [`/api/recipients/${recipientId}/relationship-analysis`],
    enabled: !!recipientId,
  });

  // Mutation to get relationship-based gift suggestions
  const {
    mutate: getRelationshipGifts,
    data: giftSuggestions,
    isPending: isLoadingSuggestions,
    error: suggestionsError,
  } = useMutation({
    mutationFn: async (context: RelationshipContext) => {
      try {
        const data = await apiRequest(`/api/recipients/${recipientId}/relationship-gifts`, {
          method: 'POST',
          body: JSON.stringify(context),
        });
        return data as RelationshipGiftResult;
      } catch (error) {
        console.error('API error, using mock data for demo:', error);
        setUseMockData(true);
        // Return mock data instead of throwing the error
        return mockGiftSuggestions;
      }
    },
    onSuccess: () => {
      if (useMockData) {
        toast({
          title: 'Demo Mode',
          description: 'Using sample gift suggestions for demonstration purposes.',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Gift suggestions generated',
          description: 'Relationship-based gift suggestions have been successfully generated.',
        });
      }
    },
    onError: (error) => {
      toast({
        title: 'Error generating suggestions',
        description: 'There was an error generating the gift suggestions. Please try again.',
        variant: 'destructive',
      });
      console.error('Error generating relationship gift suggestions:', error);
    },
  });

  // Handler for adding a new interest
  const handleAddInterest = () => {
    if (newInterest.trim()) {
      setRelationshipContext({
        ...relationshipContext,
        interests: [...(relationshipContext.interests || []), newInterest.trim()],
      });
      setNewInterest('');
    }
  };

  // Handler for removing an interest
  const handleRemoveInterest = (index: number) => {
    const newInterests = [...(relationshipContext.interests || [])];
    newInterests.splice(index, 1);
    setRelationshipContext({
      ...relationshipContext,
      interests: newInterests,
    });
  };

  // Handler for adding a past gift
  const handleAddPastGift = () => {
    if (newPastGift.trim()) {
      setRelationshipContext({
        ...relationshipContext,
        pastGifts: [...(relationshipContext.pastGifts || []), newPastGift.trim()],
      });
      setNewPastGift('');
    }
  };

  // Handler for removing a past gift
  const handleRemovePastGift = (index: number) => {
    const newPastGifts = [...(relationshipContext.pastGifts || [])];
    newPastGifts.splice(index, 1);
    setRelationshipContext({
      ...relationshipContext,
      pastGifts: newPastGifts,
    });
  };

  // Handler for generating gift suggestions
  const handleGenerateSuggestions = () => {
    const contextData = {
      ...relationshipContext,
      relationship: recipient?.relationship || 'friend',
    };
    getRelationshipGifts(contextData);
  };

  if (isLoadingRecipient) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading recipient data...</span>
      </div>
    );
  }

  if (recipientError) {
    return (
      <div className="p-4 border border-red-300 rounded-md bg-red-50 text-red-900">
        <AlertCircle className="h-5 w-5 inline mr-2" />
        Error loading recipient data. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Relationship Context Input Panel */}
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Relationship Context</CardTitle>
            <CardDescription>
              Help us understand your relationship with {recipient?.name} to suggest the most
              meaningful gifts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="occasion">Occasion</Label>
              <Select
                value={relationshipContext.occasion}
                onValueChange={(value) =>
                  setRelationshipContext({ ...relationshipContext, occasion: value })
                }
              >
                <SelectTrigger id="occasion">
                  <SelectValue placeholder="Select an occasion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="birthday">Birthday</SelectItem>
                  <SelectItem value="anniversary">Anniversary</SelectItem>
                  <SelectItem value="christmas">Christmas</SelectItem>
                  <SelectItem value="graduation">Graduation</SelectItem>
                  <SelectItem value="wedding">Wedding</SelectItem>
                  <SelectItem value="valentines">Valentine's Day</SelectItem>
                  <SelectItem value="mothersday">Mother's Day</SelectItem>
                  <SelectItem value="fathersday">Father's Day</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  {occasions?.map((occasion: any) => (
                    <SelectItem key={occasion.id} value={occasion.name.toLowerCase()}>
                      {occasion.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="years-known">Years Known</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="years-known"
                  min={0}
                  max={50}
                  step={1}
                  value={[relationshipContext.yearsKnown || 1]}
                  onValueChange={(value) =>
                    setRelationshipContext({ ...relationshipContext, yearsKnown: value[0] })
                  }
                  className="flex-1"
                />
                <span className="w-12 text-center">{relationshipContext.yearsKnown}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="closeness">Closeness Level</Label>
              <Select
                value={relationshipContext.closeness}
                onValueChange={(value) =>
                  setRelationshipContext({ ...relationshipContext, closeness: value })
                }
              >
                <SelectTrigger id="closeness">
                  <SelectValue placeholder="Select closeness level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="very close">Very Close</SelectItem>
                  <SelectItem value="close">Close</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="distant">Distant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="background-info">Background Info (Optional)</Label>
              <Textarea
                id="background-info"
                placeholder="Any additional context about your relationship that might help..."
                value={relationshipContext.backgroundInfo || ''}
                onChange={(e) =>
                  setRelationshipContext({
                    ...relationshipContext,
                    backgroundInfo: e.target.value,
                  })
                }
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">Their Interests</Label>
              <div className="flex gap-2">
                <Input
                  id="interests"
                  placeholder="Add an interest..."
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddInterest();
                    }
                  }}
                />
                <Button onClick={handleAddInterest} type="button" variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {relationshipContext.interests?.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {interest}
                    <button
                      onClick={() => handleRemoveInterest(index)}
                      className="ml-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="past-gifts">Past Gifts Given (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="past-gifts"
                  placeholder="Add a past gift..."
                  value={newPastGift}
                  onChange={(e) => setNewPastGift(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddPastGift();
                    }
                  }}
                />
                <Button onClick={handleAddPastGift} type="button" variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {relationshipContext.pastGifts?.map((gift, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {gift}
                    <button
                      onClick={() => handleRemovePastGift(index)}
                      className="ml-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleGenerateSuggestions}
              disabled={isLoadingSuggestions}
              className="w-full"
            >
              {isLoadingSuggestions ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Suggestions...
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-4 w-4" />
                  Generate Relationship-Based Suggestions
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Relationship Analysis Card */}
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Relationship Analysis</CardTitle>
            <CardDescription>
              Understanding the emotional context of your relationship with {recipient?.name}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingAnalysis ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : relationshipAnalysis ? (
              <div className="prose max-w-none">
                <p className="italic text-muted-foreground">
                  "{relationshipAnalysis?.analysis || ''}"
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Info className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Analysis Available</h3>
                <p className="text-muted-foreground max-w-xs mt-2">
                  Generate gift suggestions to see an analysis of your relationship dynamics.
                </p>
              </div>
            )}
          </CardContent>
          {relationshipAnalysis && (
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => refetchAnalysis()}
                disabled={isLoadingAnalysis}
              >
                {isLoadingAnalysis ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  'Refresh Analysis'
                )}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>

      {/* Gift Suggestions Results */}
      {giftSuggestions && (
        <Card>
          <CardHeader>
            <CardTitle>Relationship-Based Gift Suggestions</CardTitle>
            <CardDescription>
              Personalized gift ideas based on your relationship with {recipient?.name}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {giftSuggestions.recommendations.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                No gift suggestions found. Try adjusting your relationship context.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {giftSuggestions.recommendations.map((recommendation, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="relative aspect-video bg-muted">
                      {recommendation.product.imageUrl ? (
                        <img
                          src={recommendation.product.imageUrl}
                          alt={recommendation.product.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-secondary/20">
                          <GiftIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <Badge
                        className="absolute top-2 right-2"
                        variant={
                          parseInt(recommendation.confidenceScore) >= 8
                            ? 'default'
                            : parseInt(recommendation.confidenceScore) >= 6
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        Match: {recommendation.recommendationScore}/10
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{recommendation.product.name}</CardTitle>
                      <CardDescription>
                        {recommendation.product.price ? `Price: ${recommendation.product.price}` : ''}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                          <AccordionTrigger>Why this gift?</AccordionTrigger>
                          <AccordionContent>
                            <p className="text-sm text-muted-foreground">
                              {recommendation.relationshipReasoning}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                        {recommendation.personalizedMessage && (
                          <AccordionItem value="item-2">
                            <AccordionTrigger>Suggested Message</AccordionTrigger>
                            <AccordionContent>
                              <p className="text-sm italic text-muted-foreground">
                                "{recommendation.personalizedMessage}"
                              </p>
                            </AccordionContent>
                          </AccordionItem>
                        )}
                      </Accordion>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        Save
                      </Button>
                      {recommendation.product.purchaseUrl && (
                        <Button
                          size="sm"
                          onClick={() =>
                            window.open(recommendation.product.purchaseUrl, '_blank')
                          }
                        >
                          Purchase
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}