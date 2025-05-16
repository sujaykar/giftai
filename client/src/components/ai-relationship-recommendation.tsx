import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, Gift, Heart, Share2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mood options for AI recommendations
const moodOptions = [
  { label: "Thoughtful", value: "thoughtful" },
  { label: "Fun", value: "fun" },
  { label: "Romantic", value: "romantic" },
  { label: "Practical", value: "practical" },
  { label: "Luxurious", value: "luxurious" },
  { label: "Nostalgic", value: "nostalgic" },
  { label: "Creative", value: "creative" },
  { label: "Sentimental", value: "sentimental" }
];

// Occasion options for AI recommendations
const occasionOptions = [
  { label: "Birthday", value: "birthday" },
  { label: "Anniversary", value: "anniversary" },
  { label: "Christmas", value: "christmas" },
  { label: "Valentine's Day", value: "valentines_day" },
  { label: "Wedding", value: "wedding" },
  { label: "Graduation", value: "graduation" },
  { label: "Housewarming", value: "housewarming" },
  { label: "Baby Shower", value: "baby_shower" },
  { label: "Just Because", value: "just_because" }
];

type AIRecommendationFormData = {
  recipientId: string;
  mood?: string;
  occasion?: string;
  minPrice?: number;
  maxPrice?: number;
};

interface AIRelationshipRecommendationProps {
  userId: number;
  recipients: any[];
  onRecommendationsGenerated: (recommendations: any[]) => void;
}

export function AIRelationshipRecommendation({
  userId,
  recipients,
  onRecommendationsGenerated
}: AIRelationshipRecommendationProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([20, 100]);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<AIRecommendationFormData>({
    defaultValues: {
      recipientId: '',
      mood: undefined,
      occasion: undefined,
      minPrice: 20,
      maxPrice: 100
    }
  });
  
  const selectedRecipientId = watch("recipientId");
  
  // Get recipient details if one is selected
  const { data: selectedRecipient } = useQuery({
    queryKey: ['/api/recipients', selectedRecipientId],
    enabled: !!selectedRecipientId,
  });
  
  const onSubmit = async (data: AIRecommendationFormData) => {
    try {
      setIsLoading(true);
      
      const response = await apiRequest<{ recommendations: any[] }>("/api/ai-recommendations", {
        method: "POST",
        body: JSON.stringify({
          userId,
          recipientId: parseInt(data.recipientId),
          mood: data.mood,
          occasion: data.occasion,
          minPrice: priceRange[0],
          maxPrice: priceRange[1]
        })
      });
      
      if (response.recommendations && response.recommendations.length > 0) {
        onRecommendationsGenerated(response.recommendations);
        toast({
          title: "AI recommendations generated",
          description: `${response.recommendations.length} gift ideas found for your recipient`,
        });
      } else {
        toast({
          title: "No recommendations found",
          description: "Try adjusting your criteria or providing more details about your recipient",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error generating AI recommendations:", error);
      toast({
        title: "Failed to generate recommendations",
        description: "An error occurred while generating AI recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-500" />
          AI-Powered Gift Recommendations
        </CardTitle>
        <CardDescription>
          Get personalized gift ideas based on your relationship with the recipient
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="recipientId">Who is this gift for?</Label>
            <Select
              onValueChange={(value) => {
                const event = { target: { name: "recipientId", value } };
                register("recipientId").onChange(event as any);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a recipient" />
              </SelectTrigger>
              <SelectContent>
                {recipients.map((recipient) => (
                  <SelectItem key={recipient.id} value={recipient.id.toString()}>
                    {recipient.name} ({recipient.relationship})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.recipientId && (
              <p className="text-sm text-red-500">Please select a recipient</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mood">Gift Mood (Optional)</Label>
              <Select
                onValueChange={(value) => {
                  const event = { target: { name: "mood", value } };
                  register("mood").onChange(event as any);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a mood" />
                </SelectTrigger>
                <SelectContent>
                  {moodOptions.map((mood) => (
                    <SelectItem key={mood.value} value={mood.value}>
                      {mood.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="occasion">Occasion (Optional)</Label>
              <Select
                onValueChange={(value) => {
                  const event = { target: { name: "occasion", value } };
                  register("occasion").onChange(event as any);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an occasion" />
                </SelectTrigger>
                <SelectContent>
                  {occasionOptions.map((occasion) => (
                    <SelectItem key={occasion.value} value={occasion.value}>
                      {occasion.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label htmlFor="priceRange">Price Range</Label>
              <span className="text-sm text-gray-500">
                ${priceRange[0]} - ${priceRange[1]}
              </span>
            </div>
            <Slider
              defaultValue={[20, 100]}
              max={500}
              min={0}
              step={5}
              value={priceRange}
              onValueChange={handlePriceChange}
              className="py-4"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !selectedRecipientId}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Generating AI recommendations...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> 
                Generate AI Recommendations
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}