import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Heart, DollarSign, X, ThumbsUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function Recommendations() {
  // Mock user for development testing
  const user = { id: 1, name: "Demo User" };
  const queryClient = useQueryClient();
  
  const [filter, setFilter] = useState({
    recipient: "all",
    priceRange: "all",
    status: "all",
    mood: "all",
    category: "all"
  });

  // Track removed products for learning demo
  const [removedProducts, setRemovedProducts] = useState(new Set<number>());

  // Collapsible filter states
  const [filtersOpen, setFiltersOpen] = useState({
    mood: false,
    price: false,
    category: false,
    recipient: false
  });

  // Temporary filter state for apply functionality
  const [tempFilter, setTempFilter] = useState({
    recipient: "all",
    priceRange: "all",
    status: "all",
    mood: "all",
    category: "all"
  });

  // Apply filters function
  const applyFilters = () => {
    setFilter(tempFilter);
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
      recommendationScore: "76%"
    }
  ];

  // Use mock data for demo
  const recommendations = mockRecommendations;
  const isLoading = false;

  // Handle feedback actions
  const handleFeedback = (productId: number, feedbackType: string) => {
    if (feedbackType === 'too_expensive' || feedbackType === 'wrong_style') {
      setRemovedProducts(prev => new Set([...Array.from(prev), productId]));
    }
    
    // Here you would normally send feedback to your AI system
    console.log(`User feedback: ${feedbackType} for product ${productId}`);
  };

  // Filter recommendations based on selected filters and removed products
  const filteredRecommendations = recommendations.filter((rec: any) => {
    // Don't show removed products
    if (removedProducts.has(rec.product.id)) return false;
    
    let matchesPriceRange = true;
    if (filter.priceRange !== "all") {
      const price = rec.product.price;
      switch (filter.priceRange) {
        case "under-50": matchesPriceRange = price < 50; break;
        case "50-100": matchesPriceRange = price >= 50 && price <= 100; break;
        case "100-200": matchesPriceRange = price > 100 && price <= 200; break;
        case "above-200": matchesPriceRange = price > 200; break;
      }
    }
    
    let matchesMood = filter.mood === "all" || rec.mood === filter.mood;
    let matchesCategory = filter.category === "all" || rec.product.category === filter.category;
    
    return matchesPriceRange && matchesMood && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">AI Gift Recommendations</h1>
          <p className="text-lg text-gray-600">Click the feedback buttons to help the AI learn your preferences!</p>
        </div>
        
        {/* Two Section Layout: Filters Left, Products Right */}
        <div className="flex gap-8">
          
          {/* Left Section - Filters */}
          <div className="w-80 flex-shrink-0">
            <Card className="sticky top-8 shadow-lg border-0 bg-white rounded-xl">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  🎯 Smart Filters
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">Customize your gift search preferences</p>
              </CardHeader>
              
              <CardContent className="space-y-6 p-6">
                
                {/* Mood Filter */}
                <Collapsible 
                  open={filtersOpen.mood} 
                  onOpenChange={(open) => setFiltersOpen({...filtersOpen, mood: open})}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-pink-50 rounded-lg transition-colors border border-gray-200">
                    <span className="font-semibold text-gray-700">🎭 Mood</span>
                    {filtersOpen.mood ? <ChevronDown className="h-5 w-5 text-pink-500" /> : <ChevronRight className="h-5 w-5 text-gray-400" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4 space-y-3 pl-2">
                    {["all", "cozy", "elegant", "modern", "thoughtful", "active", "relaxing"].map((mood) => (
                      <label key={mood} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="radio"
                          name="mood"
                          value={mood}
                          checked={tempFilter.mood === mood}
                          onChange={(e) => setTempFilter({...tempFilter, mood: e.target.value})}
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
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-pink-50 rounded-lg transition-colors border border-gray-200">
                    <span className="font-semibold text-gray-700">💰 Price Range</span>
                    {filtersOpen.price ? <ChevronDown className="h-5 w-5 text-pink-500" /> : <ChevronRight className="h-5 w-5 text-gray-400" />}
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
                          name="priceRange"
                          value={price.value}
                          checked={tempFilter.priceRange === price.value}
                          onChange={(e) => setTempFilter({...tempFilter, priceRange: e.target.value})}
                          className="text-pink-500 focus:ring-pink-500"
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
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-pink-50 rounded-lg transition-colors border border-gray-200">
                    <span className="font-semibold text-gray-700">📂 Category</span>
                    {filtersOpen.category ? <ChevronDown className="h-5 w-5 text-pink-500" /> : <ChevronRight className="h-5 w-5 text-gray-400" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4 space-y-3 pl-2">
                    {["all", "Home & Kitchen", "Fashion", "Electronics", "Stationery", "Food & Drink"].map((category) => (
                      <label key={category} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={tempFilter.category === category}
                          onChange={(e) => setTempFilter({...tempFilter, category: e.target.value})}
                          className="text-pink-500 focus:ring-pink-500"
                        />
                        <span className="text-gray-700">{category === "all" ? "All Categories" : category}</span>
                      </label>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                {/* Apply and Clear Buttons */}
                <div className="space-y-3 pt-6 border-t border-gray-100">
                  <Button
                    onClick={applyFilters}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const resetFilters = { 
                        recipient: "all", 
                        priceRange: "all", 
                        status: "all", 
                        mood: "all", 
                        category: "all" 
                      };
                      setTempFilter(resetFilters);
                      setFilter(resetFilters);
                    }}
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Products */}
          <div className="flex-1 min-w-0">

            {/* Active Filters Display */}
            {(filter.mood !== "all" || filter.priceRange !== "all" || filter.category !== "all") && (
              <div className="mb-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
                <h3 className="font-semibold text-pink-800 mb-2">Active Filters:</h3>
                <div className="flex flex-wrap gap-2">
                  {filter.mood !== "all" && <Badge variant="secondary" className="bg-pink-100 text-pink-800">Mood: {filter.mood}</Badge>}
                  {filter.priceRange !== "all" && <Badge variant="secondary" className="bg-pink-100 text-pink-800">Price: {filter.priceRange}</Badge>}
                  {filter.category !== "all" && <Badge variant="secondary" className="bg-pink-100 text-pink-800">Category: {filter.category}</Badge>}
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-600 mx-auto"></div>
                <p className="mt-6 text-lg text-gray-600">Loading recommendations...</p>
              </div>
            )}

            {/* Recommendations Grid */}
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
                        
                        <div className="flex justify-between items-center mb-6">
                          <span className="text-3xl font-bold text-green-600">${rec.product.price}</span>
                          <Badge variant="outline" className="px-3 py-1">{rec.mood}</Badge>
                        </div>

                        {/* AI Learning Feedback Buttons */}
                        <div className="space-y-3">
                          <div className="flex gap-3">
                            <Button
                              onClick={() => handleFeedback(rec.product.id, 'like')}
                              variant="outline"
                              size="sm"
                              className="flex-1 text-green-600 border-green-300 hover:bg-green-50 transition-colors"
                            >
                              <ThumbsUp className="h-4 w-4 mr-2" />
                              Like
                            </Button>
                            <Button
                              onClick={() => handleFeedback(rec.product.id, 'too_expensive')}
                              variant="outline"
                              size="sm"
                              className="flex-1 text-orange-600 border-orange-300 hover:bg-orange-50 transition-colors"
                            >
                              <DollarSign className="h-4 w-4 mr-2" />
                              Too Expensive
                            </Button>
                          </div>
                          <Button
                            onClick={() => handleFeedback(rec.product.id, 'wrong_style')}
                            variant="outline"
                            size="sm"
                            className="w-full text-red-600 border-red-300 hover:bg-red-50 transition-colors"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Wrong Style
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
                      <Button
                        onClick={() => {
                          const resetFilters = { 
                            recipient: "all", 
                            priceRange: "all", 
                            status: "all", 
                            mood: "all", 
                            category: "all" 
                          };
                          setTempFilter(resetFilters);
                          setFilter(resetFilters);
                        }}
                        className="bg-pink-600 hover:bg-pink-700 text-white"
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AI Learning Counter */}
            {removedProducts.size > 0 && (
              <div className="mt-10 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <p className="text-blue-800 font-bold text-lg mb-2">
                  🎯 AI Learning Progress: Removed {removedProducts.size} product{removedProducts.size !== 1 ? 's' : ''} based on your feedback!
                </p>
                <p className="text-blue-700">
                  The AI is analyzing your preferences and will provide more personalized recommendations in your next session.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}