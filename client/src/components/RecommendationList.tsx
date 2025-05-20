import { useState } from "react";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define the recommendation type
interface Recommendation {
  id: number;
  title: string;
  price: number;
  image: string;
  recipient: string;
  category: string;
  occasion: string;
  rating: number;
  reviews: number;
  description: string;
  mood: string;
}

// Define the filter options type
interface FilterOptions {
  priceRange: [number, number];
  categories: string[];
  occasions: string[];
  mood: string;
}

interface RecommendationListProps {
  recommendations: Recommendation[];
  filterOptions: FilterOptions;
}

export default function RecommendationList({ 
  recommendations,
  filterOptions
}: RecommendationListProps) {
  // Filter recommendations based on the filter options
  const filteredRecommendations = recommendations.filter(item => {
    // Filter by price range
    const priceInRange = 
      item.price >= filterOptions.priceRange[0] && 
      item.price <= filterOptions.priceRange[1];
    
    // Filter by categories
    const categoryMatch = 
      filterOptions.categories.length === 0 || 
      filterOptions.categories.includes(item.category);
    
    // Filter by occasions
    const occasionMatch = 
      filterOptions.occasions.length === 0 || 
      filterOptions.occasions.includes(item.occasion);
    
    // Filter by mood
    const moodMatch = 
      !filterOptions.mood || 
      item.mood === filterOptions.mood;
    
    return priceInRange && categoryMatch && occasionMatch && moodMatch;
  });

  return (
    <div>
      {filteredRecommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRecommendations.map(recommendation => (
            <div key={recommendation.id} className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm transition-shadow hover:shadow-md">
              {/* Product Image */}
              <div className="aspect-video bg-gray-100 overflow-hidden">
                <img
                  src={recommendation.image}
                  alt={recommendation.title}
                  className="h-full w-full object-cover"
                />
              </div>
              
              {/* Content */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-medium text-indigo-600">
                    {recommendation.category}
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-yellow-500 mr-1">★</span>
                    <span className="text-sm text-gray-600">{recommendation.rating} ({recommendation.reviews})</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{recommendation.title}</h3>
                
                <div className="flex items-center mb-2">
                  <span className="text-sm text-gray-600 mr-2">For: {recommendation.recipient}</span>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                    {recommendation.occasion}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {recommendation.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">${recommendation.price.toFixed(2)}</span>
                  <div className="flex space-x-2">
                    <Button size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Gift className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No matching recommendations</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters to see more gift ideas.</p>
        </div>
      )}
    </div>
  );
}