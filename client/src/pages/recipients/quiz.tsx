import { useState, useEffect } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import PreferenceForm from "@/components/quiz/preference-form";

export default function PreferenceQuiz() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [, params] = useRoute("/recipients/quiz");
  const [currentStep, setCurrentStep] = useState(1);
  const [recipientId, setRecipientId] = useState<string | null>(null);
  
  // Parse the recipient ID from the query string
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    if (id) {
      setRecipientId(id);
    }
  }, []);

  // Fetch recipient details if ID is available
  const { data: recipient, isLoading } = useQuery({
    queryKey: recipientId ? [`/api/recipients/${recipientId}`] : [],
    enabled: !!recipientId
  });

  const addPreferenceMutation = useMutation({
    mutationFn: (data: any) => 
      apiRequest("POST", `/api/recipients/${recipientId}/preferences`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/recipients/${recipientId}/preferences`] });
      if (currentStep === 1) {
        setCurrentStep(2);
      } else {
        toast({
          title: "Preferences saved",
          description: "We'll use these to find the perfect gifts.",
        });
        navigate(`/recipients/${recipientId}`);
      }
    },
    onError: (error) => {
      console.error("Error saving preferences:", error);
      toast({
        title: "Failed to save preferences",
        description: "There was a problem saving the preferences. Please try again.",
        variant: "destructive",
      });
    }
  });

  const addOccasionMutation = useMutation({
    mutationFn: (data: any) => 
      apiRequest("POST", `/api/recipients/${recipientId}/occasions`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/recipients/${recipientId}/occasions`] });
      toast({
        title: "Special dates saved",
        description: "We'll notify you when these dates are approaching.",
      });
      navigate(`/recipients/${recipientId}`);
    },
    onError: (error) => {
      console.error("Error saving occasions:", error);
      toast({
        title: "Failed to save special dates",
        description: "There was a problem saving the special dates. Please try again.",
        variant: "destructive",
      });
    }
  });

  if (isLoading || !recipient) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSaveInterests = (interests: any) => {
    addPreferenceMutation.mutate({
      preferenceType: "interests",
      preferenceValue: interests
    });
  };

  const handleSaveGiftPreferences = (preferences: any) => {
    addPreferenceMutation.mutate({
      preferenceType: "gift_preferences",
      preferenceValue: preferences
    });
  };

  const handleSaveSpecialDates = (dates: any) => {
    dates.forEach((date: any) => {
      addOccasionMutation.mutate({
        name: date.name,
        date: date.date,
        isRecurring: date.isRecurring,
        status: "not_started"
      });
    });
  };

  const stepTitles = ["Basic Info", "Preferences", "Special Dates"];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href={`/recipients/${recipientId}`}>
            <a className="inline-flex items-center text-sm text-gray-600 hover:text-primary-500">
              <i className="ri-arrow-left-line mr-1"></i>
              Back to recipient details
            </a>
          </Link>
          <h1 className="font-heading text-2xl md:text-3xl font-bold mt-4">{recipient.name}'s Preferences</h1>
          <p className="text-gray-600 mt-2">Help us understand what {recipient.name} likes so we can find the perfect gifts</p>
        </div>
        
        {/* Preference Quiz Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="p-6">
            {/* Steps indicator */}
            <div className="flex items-center justify-between mb-8">
              <div className="w-full flex items-center">
                {stepTitles.map((title, index) => (
                  <React.Fragment key={index}>
                    <div className="relative flex items-center justify-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium
                        ${index === 0 ? 'bg-primary' : 
                          (index + 1) < currentStep ? 'bg-primary' : 
                          (index + 1) === currentStep ? 'bg-primary' : 
                          'bg-gray-200 text-gray-600'}`}>
                        {index === 0 ? (
                          <i className="ri-check-line"></i>
                        ) : (
                          (index + 1) < currentStep ? (
                            <i className="ri-check-line"></i>
                          ) : (
                            index + 1
                          )
                        )}
                      </div>
                      <span className={`absolute -bottom-6 whitespace-nowrap text-xs font-medium
                        ${index === 0 || (index + 1) <= currentStep ? 'text-primary-500' : 'text-gray-500'}`}>
                        {title}
                      </span>
                    </div>
                    {index < stepTitles.length - 1 && (
                      <div className={`h-1 flex-1 mx-2 ${index === 0 || (index + 1) < currentStep ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            {/* Preference Form */}
            <div className="mt-12">
              <PreferenceForm 
                currentStep={currentStep}
                onSaveInterests={handleSaveInterests}
                onSaveGiftPreferences={handleSaveGiftPreferences}
                onSaveSpecialDates={handleSaveSpecialDates}
                isLoading={{
                  interests: addPreferenceMutation.isPending && currentStep === 1,
                  giftPreferences: addPreferenceMutation.isPending && currentStep === 2,
                  specialDates: addOccasionMutation.isPending && currentStep === 3
                }}
                onPrevious={() => setCurrentStep(current => Math.max(1, current - 1))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
