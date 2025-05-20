import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RecommendationFilters } from "../components/RecommendationFilters";
import { Gift } from "lucide-react";

export default function RelationshipGifts() {
  // Data for recommendations
  const [recommendationData] = useState([
    { id: 1, title: "Kindle Paperwhite", price: 139.99, image: "https://m.media-amazon.com/images/I/618T0VprZbL._AC_SL1500_.jpg", recipient: "Emma Thompson", category: "Technology", occasion: "Birthday", rating: 4.8, reviews: 156, description: "The thinnest, lightest Kindle Paperwhite yet—with a flush-front design and 300 ppi glare-free display that reads like real paper even in bright sunlight.", mood: "Practical" },
    { id: 2, title: "Cooking Masterclass Subscription", price: 79.99, image: "https://gordonramsay.com/assets/Uploads/_resampled/CroppedFocusedImage1920108050-50-GRC-Pasta.jpg", recipient: "Michael Chen", category: "Experiences", occasion: "Anniversary", rating: 4.9, reviews: 98, description: "Learn cooking techniques from the world's best chefs with high-quality video lessons and detailed workbooks.", mood: "Thoughtful" },
    { id: 3, title: "Wireless Noise-Cancelling Headphones", price: 249.99, image: "https://m.media-amazon.com/images/I/71+X7OmQPYL._AC_SL1500_.jpg", recipient: "Sarah Johnson", category: "Technology", occasion: "Graduation", rating: 4.7, reviews: 203, description: "Industry-leading noise cancellation technology with premium sound quality and comfortable design for all-day listening.", mood: "Premium" },
    { id: 4, title: "Hiking Backpack", price: 89.99, image: "https://m.media-amazon.com/images/I/91euD0OojiL._AC_SL1500_.jpg", recipient: "Emma Thompson", category: "Outdoors", occasion: "Christmas", rating: 4.6, reviews: 75, description: "Durable, water-resistant backpack with multiple compartments and ergonomic design for comfort on long hikes.", mood: "Adventurous" },
    { id: 5, title: "Nintendo Switch", price: 299.99, image: "https://m.media-amazon.com/images/I/61-PblYntsL._AC_SL1500_.jpg", recipient: "Michael Chen", category: "Gaming", occasion: "Birthday", rating: 4.9, reviews: 325, description: "The versatile gaming system that lets you play your favorite games at home on the TV or on-the-go.", mood: "Fun" },
    { id: 6, title: "Art Supplies Set", price: 65.99, image: "https://m.media-amazon.com/images/I/81+qScSrDIL._AC_SL1500_.jpg", recipient: "Sarah Johnson", category: "Creativity", occasion: "Christmas", rating: 4.7, reviews: 82, description: "Complete art set with 120 premium pieces including colored pencils, watercolors, pastels, and sketch pads.", mood: "Creative" },
    { id: 7, title: "Insulated Coffee Mug", price: 29.99, image: "https://m.media-amazon.com/images/I/61eDXs9QFNL._AC_SL1500_.jpg", recipient: "Emma Thompson", category: "Home", occasion: "Valentine's Day", rating: 4.8, reviews: 112, description: "Double-walled stainless steel mug that keeps drinks hot for 12 hours or cold for 24 hours.", mood: "Practical" },
    { id: 8, title: "Chef's Knife Set", price: 129.99, image: "https://m.media-amazon.com/images/I/61p2wnYlB3L._AC_SL1000_.jpg", recipient: "Michael Chen", category: "Home", occasion: "Christmas", rating: 4.7, reviews: 89, description: "Professional-grade knife set with high-carbon stainless steel blades and ergonomic handles.", mood: "Premium" },
    { id: 9, title: "Smart Speaker", price: 79.99, image: "https://m.media-amazon.com/images/I/61XLm1sEuDL._AC_SL1000_.jpg", recipient: "Sarah Johnson", category: "Technology", occasion: "Birthday", rating: 4.6, reviews: 145, description: "Premium voice-controlled smart speaker with immersive sound and smart home capabilities.", mood: "Thoughtful" }
  ]);

  // State to track filtered recommendations
  const [filteredRecommendations, setFilteredRecommendations] = useState(recommendationData);
  
  // Extract unique categories, occasions, and moods for filters
  const categories = [...new Set(recommendationData.map(item => item.category))];
  const occasions = [...new Set(recommendationData.map(item => item.occasion))];
  const moods = [...new Set(recommendationData.map(item => item.mood))];

  // Handle applying filters
  const handleApplyFilters = (filterOptions: any) => {
    const filtered = recommendationData.filter(item => {
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
    
    setFilteredRecommendations(filtered);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Relationship-Based Gift Recommendations</h1>
        <p className="text-gray-600">Find meaningful gifts tailored to your unique relationships and occasions</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <div className="lg:col-span-1">
          <RecommendationFilters 
            onApplyFilters={handleApplyFilters}
            categories={categories}
            occasions={occasions}
            moods={moods}
          />
        </div>
        
        {/* Recommendations grid */}
        <div className="lg:col-span-3">
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
              <Button onClick={() => setFilteredRecommendations(recommendationData)}>
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}