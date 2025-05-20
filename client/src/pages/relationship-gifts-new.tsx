import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RecommendationFilters } from "../components/RecommendationFilters";
import RecommendationList from "../components/RecommendationList";
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

  // State to track filter options
  const [filterOptions, setFilterOptions] = useState({
    priceRange: [0, 500] as [number, number],
    categories: [] as string[],
    occasions: [] as string[],
    mood: ""
  });
  
  // Extract unique categories, occasions, and moods for filters
  const categories = Array.from(new Set(recommendationData.map(item => item.category)));
  const occasions = Array.from(new Set(recommendationData.map(item => item.occasion)));
  const moods = Array.from(new Set(recommendationData.map(item => item.mood)));

  // Handle applying filters
  const handleApplyFilters = (newFilters: typeof filterOptions) => {
    setFilterOptions(newFilters);
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
          <RecommendationList 
            recommendations={recommendationData}
            filterOptions={filterOptions}
          />
        </div>
      </div>
    </div>
  );
}