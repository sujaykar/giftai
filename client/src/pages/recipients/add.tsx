import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

const stepTitles = ["Basic Info", "Preferences", "Special Dates"];

const recipientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  relationship: z.string().min(1, "Please select a relationship"),
  ageRange: z.string().min(1, "Please select an age range"),
  photoUrl: z.string().optional(),
  notes: z.string().optional(),
});

type RecipientFormData = z.infer<typeof recipientSchema>;

export default function AddRecipient() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipientId, setRecipientId] = useState<number | null>(null);
  
  const form = useForm<RecipientFormData>({
    resolver: zodResolver(recipientSchema),
    defaultValues: {
      name: "",
      relationship: "",
      ageRange: "",
      photoUrl: "",
      notes: "",
    },
  });

  const onSubmit = async (data: RecipientFormData) => {
    setIsSubmitting(true);
    try {
      const response = await apiRequest("POST", "/api/recipients", {
        name: data.name,
        relationship: data.relationship,
        // Store age range as a preference
        preferences: [
          {
            preferenceType: "age_range",
            preferenceValue: data.ageRange
          },
          {
            preferenceType: "notes",
            preferenceValue: data.notes || ""
          }
        ]
      });
      
      const recipient = await response.json();
      setRecipientId(recipient.id);
      
      // Invalidate recipients query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/recipients'] });
      
      toast({
        title: "Recipient added",
        description: `${data.name} has been added to your recipients.`,
      });
      
      // Move to the next step (preferences)
      setCurrentStep(2);
    } catch (error) {
      console.error("Error adding recipient:", error);
      toast({
        title: "Failed to add recipient",
        description: "There was a problem adding this recipient. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/recipients">
            <a className="inline-flex items-center text-sm text-gray-600 hover:text-primary-500">
              <i className="ri-arrow-left-line mr-1"></i>
              Back to recipients
            </a>
          </Link>
          <h1 className="font-heading text-2xl md:text-3xl font-bold mt-4">Add New Recipient</h1>
          <p className="text-gray-600 mt-2">Let's add someone you want to find the perfect gift for</p>
        </div>
        
        {/* Multi-step form with steps indicator */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="p-6">
            {/* Steps indicator */}
            <div className="flex items-center justify-between mb-8">
              <div className="w-full flex items-center">
                {stepTitles.map((title, index) => (
                  <React.Fragment key={index}>
                    <div className="relative flex items-center justify-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium
                        ${currentStep > index + 1 ? 'bg-primary' : currentStep === index + 1 ? 'bg-primary' : 'bg-gray-200 text-gray-600'}`}>
                        {currentStep > index + 1 ? (
                          <i className="ri-check-line"></i>
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span className={`absolute -bottom-6 whitespace-nowrap text-xs font-medium
                        ${currentStep >= index + 1 ? 'text-primary-500' : 'text-gray-500'}`}>
                        {title}
                      </span>
                    </div>
                    {index < stepTitles.length - 1 && (
                      <div className={`h-1 flex-1 mx-2 ${currentStep > index + 1 ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            {/* Step 1: Basic Information Form */}
            {currentStep === 1 && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient's Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="relationship"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relationship</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select relationship" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="spouse">Spouse/Partner</SelectItem>
                              <SelectItem value="parent">Parent</SelectItem>
                              <SelectItem value="child">Child</SelectItem>
                              <SelectItem value="sibling">Sibling</SelectItem>
                              <SelectItem value="friend">Friend</SelectItem>
                              <SelectItem value="colleague">Colleague</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="ageRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age Range</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select age range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0-12">Child (0-12)</SelectItem>
                            <SelectItem value="13-17">Teenager (13-17)</SelectItem>
                            <SelectItem value="18-24">Young Adult (18-24)</SelectItem>
                            <SelectItem value="25-34">Adult (25-34)</SelectItem>
                            <SelectItem value="35-44">Adult (35-44)</SelectItem>
                            <SelectItem value="45-54">Adult (45-54)</SelectItem>
                            <SelectItem value="55-64">Adult (55-64)</SelectItem>
                            <SelectItem value="65+">Senior (65+)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="photoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Photo (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="url"
                            placeholder="Enter photo URL (e.g., from Google Photos, Instagram, etc.)"
                            {...field}
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          Add a photo URL to help personalize gift recommendations. This is completely optional.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Add any additional information that might help with gift recommendations"
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          Continue to Preferences
                          <i className="ri-arrow-right-line ml-1"></i>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
            
            {/* Step 2: Placeholder for Preferences */}
            {currentStep === 2 && recipientId && (
              <div className="mt-12 text-center">
                <p className="mb-4">Redirecting to preferences quiz...</p>
                <Button 
                  onClick={() => navigate(`/recipients/quiz?id=${recipientId}`)}
                  className="mx-auto"
                >
                  Continue to Preferences Quiz
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
