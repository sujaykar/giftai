import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Recommendations() {
  // Mock user for development testing
  const user = { id: 1, name: "Demo User" };
  const queryClient = useQueryClient();
  
  // Separate filter states for each tab
  const [recipientFilter, setRecipientFilter] = useState({
    recipient: "all",
    priceRange: "all",
    mood: "all",
    category: "all"
  });

  const [occasionFilter, setOccasionFilter] = useState({
    occasion: "all",
    priceRange: "all",
    mood: "all",
    category: "all"
  });



  // Collapsible filter states
  const [filtersOpen, setFiltersOpen] = useState({
    mood: false,
    price: false,
    category: false,
    recipient: false
  });

  // Temporary filter states for apply functionality
  const [tempRecipientFilter, setTempRecipientFilter] = useState({
    recipient: "all",
    priceRange: "all",
    mood: "all",
    category: "all"
  });

  const [tempOccasionFilter, setTempOccasionFilter] = useState({
    occasion: "all",
    priceRange: "all",
    mood: "all",
    category: "all"
  });

  // Mock recipients data
  const mockRecipients = [
    { id: 1, name: "Mom", relationship: "Mother" },
    { id: 2, name: "Dad", relationship: "Father" },
    { id: 3, name: "Sarah", relationship: "Sister" },
    { id: 4, name: "Mike", relationship: "Brother" },
    { id: 5, name: "Emma", relationship: "Best Friend" },
    { id: 6, name: "Alex", relationship: "Colleague" }
  ];

  // Mock occasions data
  const mockOccasions = [
    { id: 1, name: "Christmas", type: "Holiday" },
    { id: 2, name: "Birthday", type: "Personal" },
    { id: 3, name: "Thanksgiving", type: "Holiday" },
    { id: 4, name: "Valentine's Day", type: "Holiday" },
    { id: 5, name: "Mother's Day", type: "Holiday" },
    { id: 6, name: "Father's Day", type: "Holiday" },
    { id: 7, name: "Anniversary", type: "Personal" },
    { id: 8, name: "Graduation", type: "Milestone" }
  ];

  // Apply filters functions
  const applyRecipientFilters = () => {
    setRecipientFilter(tempRecipientFilter);
  };

  const applyOccasionFilters = () => {
    setOccasionFilter(tempOccasionFilter);
  };



  // Mock data for learning demo
  const mockRecommendations = [
    {
      id: 1,
      uuid: "rec-1",
      productId: 1,
      product: {
        id: 1,
        name: "Artisan Ceramic Coffee Mug",
        price: 35,
        category: "Home & Kitchen",
        imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop",
        description: "Handcrafted ceramic mug with unique glaze pattern"
      },
      mood: "cozy",
      occasion: "Christmas",
      recipientName: "Mom",
      recommendationScore: "85%"
    },
    {
      id: 2,
      uuid: "rec-2", 
      productId: 2,
      product: {
        id: 2,
        name: "Luxury Silk Scarf",
        price: 150,
        category: "Fashion",
        imageUrl: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=300&h=300&fit=crop",
        description: "Premium silk scarf with elegant pattern"
      },
      mood: "elegant",
      occasion: "Anniversary",
      recipientName: "Sarah",
      recommendationScore: "78%"
    },
    {
      id: 3,
      uuid: "rec-3",
      productId: 3,
      product: {
        id: 3,
        name: "Wireless Earbuds Pro",
        price: 199,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1590658165737-15a047b7ade8?w=300&h=300&fit=crop",
        description: "High-quality wireless earbuds with noise cancellation"
      },
      mood: "modern",
      occasion: "Birthday",
      recipientName: "Mike",
      recommendationScore: "92%"
    },
    {
      id: 4,
      uuid: "rec-4",
      productId: 4,
      product: {
        id: 4,
        name: "Vintage Leather Journal",
        price: 45,
        category: "Stationery",
        imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&h=300&fit=crop",
        description: "Handbound leather journal with aged paper"
      },
      mood: "thoughtful",
      occasion: "Graduation",
      recipientName: "Emma",
      recommendationScore: "88%"
    },
    {
      id: 5,
      uuid: "rec-5",
      productId: 5,
      product: {
        id: 5,
        name: "Smart Fitness Watch",
        price: 249,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=300&h=300&fit=crop",
        description: "Advanced fitness tracking with heart rate monitoring"
      },
      mood: "active",
      occasion: "Valentine's Day",
      recipientName: "Alex",
      recommendationScore: "81%"
    },
    {
      id: 6,
      uuid: "rec-6",
      productId: 6,
      product: {
        id: 6,
        name: "Gourmet Tea Set",
        price: 89,
        category: "Food & Drink",
        imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=300&fit=crop",
        description: "Premium tea collection with bamboo gift box"
      },
      mood: "relaxing",
      occasion: "Thanksgiving",
      recipientName: "Dad",
      recommendationScore: "76%"
    }
  ];

  // Use mock data for demo
  const recommendations = mockRecommendations;
  const isLoading = false;



  // Filter recommendations based on selected filters
  const getFilteredRecommendations = (isRecipientTab: boolean) => {
    const currentFilter = isRecipientTab ? recipientFilter : occasionFilter;
    
    return recommendations.filter((rec: any) => {
      
      let matchesPriceRange = true;
      if (currentFilter.priceRange !== "all") {
        const price = rec.product.price;
        switch (currentFilter.priceRange) {
          case "under-50": matchesPriceRange = price < 50; break;
          case "50-100": matchesPriceRange = price >= 50 && price <= 100; break;
          case "100-200": matchesPriceRange = price > 100 && price <= 200; break;
          case "above-200": matchesPriceRange = price > 200; break;
        }
      }
      
      let matchesMood = currentFilter.mood === "all" || rec.mood === currentFilter.mood;
      let matchesCategory = currentFilter.category === "all" || rec.product.category === currentFilter.category;
      
      // Additional filtering based on tab
      if (isRecipientTab) {
        let matchesRecipient = currentFilter.recipient === "all" || rec.recipientName === mockRecipients.find(r => r.id.toString() === currentFilter.recipient)?.name;
        return matchesPriceRange && matchesMood && matchesCategory && matchesRecipient;
      } else {
        let matchesOccasion = currentFilter.occasion === "all" || rec.occasion === currentFilter.occasion;
        return matchesPriceRange && matchesMood && matchesCategory && matchesOccasion;
      }
    });
  };

  // Render filter section for recipients
  const renderRecipientFilters = () => (
    <div className="w-80 flex-shrink-0 space-y-4">
      {/* Enhanced Filter Card */}
      <Card className="shadow-xl border-0 bg-white rounded-xl overflow-hidden">
        <CardHeader className="pb-4 border-b border-gray-100 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <CardTitle className="text-xl font-bold flex items-center">
            👤 Recipient Filters
          </CardTitle>
          <p className="text-blue-100 mt-1">Find perfect gifts for your loved ones</p>
        </CardHeader>
        
        <CardContent className="space-y-6 p-6">
          
          {/* Recipient Dropdown */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <label className="flex items-center text-sm font-bold text-blue-800 mb-3">
              👤 Who are you shopping for?
            </label>
            <select
              value={tempRecipientFilter.recipient}
              onChange={(e) => setTempRecipientFilter({...tempRecipientFilter, recipient: e.target.value})}
              className="w-full p-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <option value="all">🌟 Show gifts for everyone</option>
              {mockRecipients.map((recipient) => (
                <option key={recipient.id} value={recipient.id}>
                  {recipient.name} ({recipient.relationship})
                </option>
              ))}
            </select>
          </div>

          {/* Results Counter */}
          <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 text-center">
            <p className="text-sm font-semibold text-green-800">
              🎁 {getFilteredRecommendations(true).length} perfect gifts found!
            </p>
          </div>

          {/* Common Filters */}
          {renderCommonFilters(tempRecipientFilter, setTempRecipientFilter)}

          {/* Apply and Clear Buttons */}
          <div className="space-y-3 pt-6 border-t border-gray-100">
            <Button
              onClick={applyRecipientFilters}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Apply Filters
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const resetFilters = { 
                  recipient: "all", 
                  priceRange: "all", 
                  mood: "all", 
                  category: "all" 
                };
                setTempRecipientFilter(resetFilters);
                setRecipientFilter(resetFilters);
              }}
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg"
            >
              Clear All Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render filter section for occasions
  const renderOccasionFilters = () => (
    <div className="w-80 flex-shrink-0 space-y-4">
      {/* Enhanced Filter Card */}
      <Card className="shadow-xl border-0 bg-white rounded-xl overflow-hidden">
        <CardHeader className="pb-4 border-b border-gray-100 bg-gradient-to-r from-purple-500 to-pink-600 text-white">
          <CardTitle className="text-xl font-bold flex items-center">
            🎉 Occasion Filters
          </CardTitle>
          <p className="text-purple-100 mt-1">Discover gifts perfect for every celebration</p>
        </CardHeader>
        
        <CardContent className="space-y-6 p-6">
          
          {/* Occasion Dropdown */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <label className="flex items-center text-sm font-bold text-purple-800 mb-3">
              🎉 What's the special occasion?
            </label>
            <select
              value={tempOccasionFilter.occasion}
              onChange={(e) => setTempOccasionFilter({...tempOccasionFilter, occasion: e.target.value})}
              className="w-full p-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <option value="all">🎊 Perfect for any celebration</option>
              {mockOccasions.map((occasion) => (
                <option key={occasion.id} value={occasion.name}>
                  {occasion.name} ({occasion.type})
                </option>
              ))}
            </select>
          </div>

          {/* Results Counter */}
          <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 text-center">
            <p className="text-sm font-semibold text-green-800">
              🎁 {getFilteredRecommendations(false).length} perfect gifts found!
            </p>
          </div>

          {/* Common Filters */}
          {renderCommonFilters(tempOccasionFilter, setTempOccasionFilter)}

          {/* Apply and Clear Buttons */}
          <div className="space-y-3 pt-6 border-t border-gray-100">
            <Button
              onClick={applyOccasionFilters}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Apply Filters
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const resetFilters = { 
                  occasion: "all", 
                  priceRange: "all", 
                  mood: "all", 
                  category: "all" 
                };
                setTempOccasionFilter(resetFilters);
                setOccasionFilter(resetFilters);
              }}
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg"
            >
              Clear All Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render common filters (mood, price, category)
  const renderCommonFilters = (filter: any, setFilter: any) => (
    <>
      {/* Mood Filter */}
      <Collapsible 
        open={filtersOpen.mood} 
        onOpenChange={(open) => setFiltersOpen({...filtersOpen, mood: open})}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 rounded-lg transition-all duration-200 border-2 border-pink-200 hover:border-pink-300 shadow-sm hover:shadow-md">
          <span className="font-bold text-pink-700 flex items-center">
            🎭 What's the vibe?
            <Badge variant="secondary" className="ml-2 text-xs">{filter.mood !== "all" ? filter.mood : "Any"}</Badge>
          </span>
          {filtersOpen.mood ? <ChevronDown className="h-5 w-5 text-pink-500" /> : <ChevronRight className="h-5 w-5 text-pink-400" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-3 pl-2">
          {["all", "cozy", "elegant", "modern", "thoughtful", "active", "relaxing"].map((mood) => (
            <label key={mood} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="radio"
                name={`mood-${Math.random()}`}
                value={mood}
                checked={filter.mood === mood}
                onChange={(e) => setFilter({...filter, mood: e.target.value})}
                className="text-pink-500 focus:ring-pink-500"
              />
              <span className="capitalize text-gray-700">{mood === "all" ? "All Moods" : mood}</span>
            </label>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Price Filter */}
      <Collapsible 
        open={filtersOpen.price} 
        onOpenChange={(open) => setFiltersOpen({...filtersOpen, price: open})}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-lg transition-all duration-200 border-2 border-green-200 hover:border-green-300 shadow-sm hover:shadow-md">
          <span className="font-bold text-green-700 flex items-center">
            💰 Price Range
            <Badge variant="secondary" className="ml-2 text-xs">{filter.priceRange !== "all" ? filter.priceRange : "Any"}</Badge>
          </span>
          {filtersOpen.price ? <ChevronDown className="h-5 w-5 text-green-500" /> : <ChevronRight className="h-5 w-5 text-green-400" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-3 pl-2">
          {[
            {value: "all", label: "All Prices"},
            {value: "under-50", label: "Under $50"},
            {value: "50-100", label: "$50 - $100"},
            {value: "100-200", label: "$100 - $200"},
            {value: "above-200", label: "Above $200"}
          ].map((price) => (
            <label key={price.value} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="radio"
                name={`price-${Math.random()}`}
                value={price.value}
                checked={filter.priceRange === price.value}
                onChange={(e) => setFilter({...filter, priceRange: e.target.value})}
                className="text-green-500 focus:ring-green-500"
              />
              <span className="text-gray-700">{price.label}</span>
            </label>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Category Filter */}
      <Collapsible 
        open={filtersOpen.category} 
        onOpenChange={(open) => setFiltersOpen({...filtersOpen, category: open})}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 rounded-lg transition-all duration-200 border-2 border-orange-200 hover:border-orange-300 shadow-sm hover:shadow-md">
          <span className="font-bold text-orange-700 flex items-center">
            📂 Category
            <Badge variant="secondary" className="ml-2 text-xs">{filter.category !== "all" ? filter.category : "Any"}</Badge>
          </span>
          {filtersOpen.category ? <ChevronDown className="h-5 w-5 text-orange-500" /> : <ChevronRight className="h-5 w-5 text-orange-400" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-3 pl-2">
          {["all", "Home & Kitchen", "Fashion", "Electronics", "Stationery", "Food & Drink"].map((category) => (
            <label key={category} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="radio"
                name={`category-${Math.random()}`}
                value={category}
                checked={filter.category === category}
                onChange={(e) => setFilter({...filter, category: e.target.value})}
                className="text-orange-500 focus:ring-orange-500"
              />
              <span className="text-gray-700">{category === "all" ? "All Categories" : category}</span>
            </label>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </>
  );

  // Render product grid
  const renderProductGrid = (filteredRecommendations: any[]) => (
    <div className="flex-1 min-w-0">
      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-600 mx-auto"></div>
          <p className="mt-6 text-lg text-gray-600">Loading recommendations...</p>
        </div>
      )}

      {/* Product Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredRecommendations.length > 0 ? (
            filteredRecommendations.map((rec: any) => (
              <Card key={rec.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white rounded-xl border-0 shadow-lg">
                <div className="aspect-square overflow-hidden relative">
                  <img 
                    src={rec.product.imageUrl} 
                    alt={rec.product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 text-gray-800 shadow-md">
                      {rec.recommendationScore}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="mb-3">
                    <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2">{rec.product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{rec.product.description}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-3xl font-bold text-green-600">${rec.product.price}</span>
                    <Badge variant="outline" className="px-3 py-1">{rec.mood}</Badge>
                  </div>

                  {/* Occasion Display */}
                  <div className="mb-4 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-pink-800">Perfect for:</p>
                        <p className="text-lg font-bold text-purple-700">{rec.occasion || "Any Occasion"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">For:</p>
                        <p className="font-semibold text-gray-800">{rec.recipientName || "Anyone"}</p>
                      </div>
                    </div>
                  </div>

                  {/* View Product Button */}
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      View Product Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="max-w-md mx-auto">
                <p className="text-xl text-gray-600 mb-4">No recommendations found matching your filters.</p>
                <p className="text-gray-500 mb-6">Try adjusting your filters or clearing them to see more gift options.</p>
              </div>
            </div>
          )}
        </div>
      )}


    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">AI Gift Recommendations</h1>
          <p className="text-lg text-gray-600">Choose your shopping approach and let AI find the perfect gifts!</p>
        </div>
        
        {/* Tabs for Two Different Experiences */}
        <Tabs defaultValue="recipients" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="recipients" className="text-lg py-3">
              👤 Shop by Recipients
            </TabsTrigger>
            <TabsTrigger value="occasions" className="text-lg py-3">
              🎉 Shop by Occasions
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Shop by Recipients */}
          <TabsContent value="recipients" className="space-y-0">
            <div className="flex gap-8">
              {renderRecipientFilters()}
              {renderProductGrid(getFilteredRecommendations(true))}
            </div>
          </TabsContent>

          {/* Tab 2: Shop by Occasions */}
          <TabsContent value="occasions" className="space-y-0">
            <div className="flex gap-8">
              {renderOccasionFilters()}
              {renderProductGrid(getFilteredRecommendations(false))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}