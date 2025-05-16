import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn, formatDateToLocal } from "@/lib/utils";

interface PreferenceFormProps {
  currentStep: number;
  onSaveInterests: (interests: any) => void;
  onSaveGiftPreferences: (preferences: any) => void;
  onSaveSpecialDates: (dates: any) => void;
  isLoading: {
    interests: boolean;
    giftPreferences: boolean;
    specialDates: boolean;
  };
  onPrevious: () => void;
}

// Common interests for checkboxes
const commonInterests = [
  "Reading", "Cooking", "Fitness", "Gaming", "Art", "Music", 
  "Travel", "Gardening", "Technology", "Crafts", "Fashion", "Sports",
  "Hiking", "Photography", "Movies", "Wine", "Coffee", "Pets",
  "Home Decor", "DIY", "Yoga", "Meditation"
];

export default function PreferenceForm({ 
  currentStep, 
  onSaveInterests, 
  onSaveGiftPreferences, 
  onSaveSpecialDates,
  isLoading,
  onPrevious
}: PreferenceFormProps) {
  // Step 1: Interests form
  const interestsSchema = z.object({
    interests: z.array(z.string()).min(1, "Please select at least one interest"),
    customInterests: z.string().optional(),
  });
  const interestsForm = useForm<z.infer<typeof interestsSchema>>({
    resolver: zodResolver(interestsSchema),
    defaultValues: {
      interests: [],
      customInterests: "",
    },
  });

  // Step 2: Gift preferences form
  const giftPreferencesSchema = z.object({
    budget: z.string().min(1, "Please select a budget range"),
    giftTypes: z.array(z.string()).min(1, "Please select at least one gift type"),
    avoidItems: z.string().optional(),
  });
  const giftPreferencesForm = useForm<z.infer<typeof giftPreferencesSchema>>({
    resolver: zodResolver(giftPreferencesSchema),
    defaultValues: {
      budget: "",
      giftTypes: [],
      avoidItems: "",
    },
  });

  // Step 3: Special dates form
  const [specialDates, setSpecialDates] = useState<{ 
    name: string; 
    date: Date; 
    isRecurring: boolean;
  }[]>([
    { name: "Birthday", date: new Date(), isRecurring: true }
  ]);
  const [currentDate, setCurrentDate] = useState<Date | undefined>(new Date());
  const [currentOccasion, setCurrentOccasion] = useState("Birthday");
  const [isDateRecurring, setIsDateRecurring] = useState(true);
  
  const handleInterestsSubmit = (data: z.infer<typeof interestsSchema>) => {
    // Combine checkbox interests and custom interests
    const allInterests = [...data.interests];
    
    // Add custom interests if present
    if (data.customInterests) {
      const customInterestsList = data.customInterests
        .split(',')
        .map(interest => interest.trim())
        .filter(interest => interest.length > 0);
      
      allInterests.push(...customInterestsList);
    }
    
    // Save the interests and move to the next step
    onSaveInterests(allInterests);
  };

  const handleGiftPreferencesSubmit = (data: z.infer<typeof giftPreferencesSchema>) => {
    // Save the gift preferences
    onSaveGiftPreferences({
      budget: data.budget,
      giftTypes: data.giftTypes,
      avoidItems: data.avoidItems
    });
  };

  const handleAddSpecialDate = () => {
    if (currentDate && currentOccasion) {
      setSpecialDates([
        ...specialDates,
        {
          name: currentOccasion,
          date: currentDate,
          isRecurring: isDateRecurring
        }
      ]);
      
      // Reset the form for next entry
      setCurrentDate(new Date());
      setCurrentOccasion("Birthday");
      setIsDateRecurring(true);
    }
  };

  const handleRemoveSpecialDate = (index: number) => {
    setSpecialDates(specialDates.filter((_, i) => i !== index));
  };

  const handleSaveSpecialDates = () => {
    onSaveSpecialDates(specialDates);
  };

  if (currentStep === 1) {
    // Interests & Hobbies step
    return (
      <Form {...interestsForm}>
        <form onSubmit={interestsForm.handleSubmit(handleInterestsSubmit)} className="space-y-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Interests & Hobbies</h3>
            <p className="text-sm text-gray-600 mb-4">Select all that apply or add custom interests</p>
            
            <FormField
              control={interestsForm.control}
              name="interests"
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {commonInterests.map((interest) => (
                      <FormField
                        key={interest}
                        control={interestsForm.control}
                        name="interests"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={interest}
                              className="flex flex-row items-start space-x-2 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(interest)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, interest])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== interest
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {interest}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="mt-4">
              <FormField
                control={interestsForm.control}
                name="customInterests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Interests (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Separate multiple interests with commas"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isLoading.interests}>
              {isLoading.interests ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  Continue to Gift Preferences
                  <i className="ri-arrow-right-line ml-1"></i>
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    );
  }
  
  if (currentStep === 2) {
    // Gift Preferences step
    return (
      <Form {...giftPreferencesForm}>
        <form onSubmit={giftPreferencesForm.handleSubmit(handleGiftPreferencesSubmit)} className="space-y-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Gift Preferences</h3>
            
            <div className="space-y-6">
              <FormField
                control={giftPreferencesForm.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Range</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="under-25">Under $25</SelectItem>
                        <SelectItem value="25-50">$25 - $50</SelectItem>
                        <SelectItem value="50-100">$50 - $100</SelectItem>
                        <SelectItem value="100-200">$100 - $200</SelectItem>
                        <SelectItem value="200-500">$200 - $500</SelectItem>
                        <SelectItem value="over-500">Over $500</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={giftPreferencesForm.control}
                name="giftTypes"
                render={() => (
                  <FormItem>
                    <FormLabel>Gift Types Preferred</FormLabel>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      {[
                        "Practical/Useful Items",
                        "Luxury/Premium Items",
                        "Experiences",
                        "Handmade/Artisanal",
                        "Personalized Items",
                        "Subscription Services"
                      ].map((type) => (
                        <FormField
                          key={type}
                          control={giftPreferencesForm.control}
                          name="giftTypes"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={type}
                                className="flex flex-row items-start space-x-2 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(type)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, type])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== type
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {type}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={giftPreferencesForm.control}
                name="avoidItems"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Things to Avoid</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Any categories, materials, or specific items to avoid?"
                        className="resize-none"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-between">
            <Button type="button" variant="outline" onClick={onPrevious}>
              <i className="ri-arrow-left-line mr-1"></i>
              Previous
            </Button>
            <Button type="submit" disabled={isLoading.giftPreferences}>
              {isLoading.giftPreferences ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  Continue to Special Dates
                  <i className="ri-arrow-right-line ml-1"></i>
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    );
  }
  
  if (currentStep === 3) {
    // Special Dates step
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Special Dates</h3>
          <p className="text-sm text-gray-600 mb-4">Add important dates to receive gift reminders</p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occasion</label>
                <Select 
                  value={currentOccasion}
                  onValueChange={setCurrentOccasion}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select occasion type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Birthday">Birthday</SelectItem>
                    <SelectItem value="Anniversary">Anniversary</SelectItem>
                    <SelectItem value="Christmas">Christmas</SelectItem>
                    <SelectItem value="Valentine's Day">Valentine's Day</SelectItem>
                    <SelectItem value="Graduation">Graduation</SelectItem>
                    <SelectItem value="Wedding">Wedding</SelectItem>
                    <SelectItem value="Baby Shower">Baby Shower</SelectItem>
                    <SelectItem value="Housewarming">Housewarming</SelectItem>
                    <SelectItem value="Mother's Day">Mother's Day</SelectItem>
                    <SelectItem value="Father's Day">Father's Day</SelectItem>
                    <SelectItem value="Other">Other Occasion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !currentDate && "text-muted-foreground"
                      )}
                    >
                      <i className="ri-calendar-line mr-2"></i>
                      {currentDate ? formatDateToLocal(currentDate) : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={currentDate}
                      onSelect={setCurrentDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex items-end">
                <div className="flex-1">
                  <label className="flex items-center space-x-2 mb-4">
                    <Checkbox 
                      checked={isDateRecurring}
                      onCheckedChange={(checked) => setIsDateRecurring(!!checked)}
                    />
                    <span className="text-sm text-gray-700">Recurring annually</span>
                  </label>
                  <Button 
                    type="button" 
                    onClick={handleAddSpecialDate}
                    disabled={!currentDate || !currentOccasion}
                  >
                    <i className="ri-add-line mr-1"></i>
                    Add Date
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Display added dates */}
          {specialDates.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Added Dates:</h4>
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {specialDates.map((date, index) => (
                  <li 
                    key={index} 
                    className="flex items-center justify-between bg-white p-3 rounded-md border border-gray-200"
                  >
                    <div>
                      <p className="font-medium text-sm">{date.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatDateToLocal(date.date)}
                        {date.isRecurring && " (Recurring annually)"}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveSpecialDate(index)}
                    >
                      <i className="ri-delete-bin-line text-red-500"></i>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="pt-4 flex justify-between">
          <Button type="button" variant="outline" onClick={onPrevious}>
            <i className="ri-arrow-left-line mr-1"></i>
            Previous
          </Button>
          <Button onClick={handleSaveSpecialDates} disabled={isLoading.specialDates}>
            {isLoading.specialDates ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                Saving...
              </>
            ) : (
              "Save Special Dates"
            )}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
