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
  const [removedProducts, setRemovedProducts] = useState(new Set());

  // Collapsible filter states
  const [filtersOpen, setFiltersOpen] = useState({
    mood: false,
    price: false,
    category: false,
    recipient: false
  });

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
      setRemovedProducts(prev => new Set([...prev, productId]));
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar - Collapsible Filters */}
        <div className="lg:w-80 flex-shrink-0">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>AI Learning Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Mood Filter */}
              <Collapsible 
                open={filtersOpen.mood} 
                onOpenChange={(open) => setFiltersOpen({...filtersOpen, mood: open})}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
                  <span className="font-medium">Mood</span>
                  {filtersOpen.mood ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2 space-y-2">
                  {["all", "cozy", "elegant", "modern", "thoughtful", "active", "relaxing"].map((mood) => (
                    <label key={mood} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mood"
                        value={mood}
                        checked={filter.mood === mood}
                        onChange={(e) => setFilter({...filter, mood: e.target.value})}
                        className="text-pink-500"
                      />
                      <span className="capitalize">{mood === "all" ? "All Moods" : mood}</span>
                    </label>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              {/* Price Filter */}
              <Collapsible 
                open={filtersOpen.price} 
                onOpenChange={(open) => setFiltersOpen({...filtersOpen, price: open})}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
                  <span className="font-medium">Price Range</span>
                  {filtersOpen.price ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2 space-y-2">
                  {[
                    {value: "all", label: "All Prices"},
                    {value: "under-50", label: "Under $50"},
                    {value: "50-100", label: "$50 - $100"},
                    {value: "100-200", label: "$100 - $200"},
                    {value: "above-200", label: "Above $200"}
                  ].map((price) => (
                    <label key={price.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priceRange"
                        value={price.value}
                        checked={filter.priceRange === price.value}
                        onChange={(e) => setFilter({...filter, priceRange: e.target.value})}
                        className="text-pink-500"
                      />
                      <span>{price.label}</span>
                    </label>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              {/* Category Filter */}
              <Collapsible 
                open={filtersOpen.category} 
                onOpenChange={(open) => setFiltersOpen({...filtersOpen, category: open})}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
                  <span className="font-medium">Category</span>
                  {filtersOpen.category ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2 space-y-2">
                  {["all", "Home & Kitchen", "Fashion", "Electronics", "Stationery", "Food & Drink"].map((category) => (
                    <label key={category} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={filter.category === category}
                        onChange={(e) => setFilter({...filter, category: e.target.value})}
                        className="text-pink-500"
                      />
                      <span>{category === "all" ? "All Categories" : category}</span>
                    </label>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={() => setFilter({ 
                  recipient: "all", 
                  priceRange: "all", 
                  status: "all", 
                  mood: "all", 
                  category: "all" 
                })}
                className="w-full"
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Content - Product Recommendations */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Gift Recommendations</h1>
            <p className="text-gray-600">Click the feedback buttons to help the AI learn your preferences!</p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading recommendations...</p>
            </div>
          )}

          {/* Recommendations Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRecommendations.length > 0 ? (
                filteredRecommendations.map((rec: any) => (
                  <Card key={rec.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={rec.product.imageUrl} 
                        alt={rec.product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg line-clamp-2">{rec.product.name}</h3>
                        <Badge variant="secondary" className="ml-2 shrink-0">
                          {rec.recommendationScore}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{rec.product.description}</p>
                      
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-green-600">${rec.product.price}</span>
                        <Badge variant="outline">{rec.mood}</Badge>
                      </div>

                      {/* AI Learning Feedback Buttons */}
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleFeedback(rec.product.id, 'like')}
                            variant="outline"
                            size="sm"
                            className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Like
                          </Button>
                          <Button
                            onClick={() => handleFeedback(rec.product.id, 'too_expensive')}
                            variant="outline"
                            size="sm"
                            className="flex-1 text-orange-600 border-orange-200 hover:bg-orange-50"
                          >
                            <DollarSign className="h-4 w-4 mr-1" />
                            Too Expensive
                          </Button>
                        </div>
                        <Button
                          onClick={() => handleFeedback(rec.product.id, 'wrong_style')}
                          variant="outline"
                          size="sm"
                          className="w-full text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Wrong Style
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 text-lg">No recommendations found matching your filters.</p>
                  <p className="text-gray-500 mt-2">Try adjusting your filters or clearing them to see more options.</p>
                </div>
              )}
            </div>
          )}

          {/* Removed Products Counter */}
          {removedProducts.size > 0 && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 font-medium">
                🎯 AI Learning: Removed {removedProducts.size} product{removedProducts.size !== 1 ? 's' : ''} based on your feedback!
              </p>
              <p className="text-blue-600 text-sm mt-1">
                The AI is learning your preferences and will show better recommendations next time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}