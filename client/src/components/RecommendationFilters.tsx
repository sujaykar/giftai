import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface FilterOptions {
  priceRange: [number, number];
  categories: string[];
  occasions: string[];
  mood: string;
}

interface RecommendationFiltersProps {
  onApplyFilters: (filters: FilterOptions) => void;
  categories: string[];
  occasions: string[];
  moods: string[];
}

export function RecommendationFilters({
  onApplyFilters,
  categories,
  occasions,
  moods
}: RecommendationFiltersProps) {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    priceRange: [0, 500],
    categories: [],
    occasions: [],
    mood: ""
  });

  const handlePriceChange = (value: number[]) => {
    setFilterOptions({
      ...filterOptions,
      priceRange: [value[0], value[1] || 500]
    });
  };

  const handleCategoryChange = (value: string) => {
    const newCategories = filterOptions.categories.includes(value)
      ? filterOptions.categories.filter(c => c !== value)
      : [...filterOptions.categories, value];
    
    setFilterOptions({
      ...filterOptions,
      categories: newCategories
    });
  };

  const handleOccasionChange = (value: string) => {
    const newOccasions = filterOptions.occasions.includes(value)
      ? filterOptions.occasions.filter(o => o !== value)
      : [...filterOptions.occasions, value];
    
    setFilterOptions({
      ...filterOptions,
      occasions: newOccasions
    });
  };

  const handleMoodChange = (value: string) => {
    setFilterOptions({
      ...filterOptions,
      mood: value
    });
  };

  const handleReset = () => {
    setFilterOptions({
      priceRange: [0, 500],
      categories: [],
      occasions: [],
      mood: ""
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Filter Recommendations</h3>
      
      <div className="space-y-6">
        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Price Range: ${filterOptions.priceRange[0]} - ${filterOptions.priceRange[1]}
          </label>
          <Slider
            defaultValue={[0, 500]}
            max={500}
            step={5}
            value={[filterOptions.priceRange[0], filterOptions.priceRange[1]]}
            onValueChange={handlePriceChange}
            className="mt-2"
          />
        </div>
        
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <Select onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filterOptions.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {filterOptions.categories.map(category => (
                <span 
                  key={category}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100"
                >
                  {category}
                  <button
                    onClick={() => handleCategoryChange(category)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Occasion Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Occasion</label>
          <Select onValueChange={handleOccasionChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select occasion" />
            </SelectTrigger>
            <SelectContent>
              {occasions.map(occasion => (
                <SelectItem key={occasion} value={occasion}>{occasion}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filterOptions.occasions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {filterOptions.occasions.map(occasion => (
                <span 
                  key={occasion}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100"
                >
                  {occasion}
                  <button
                    onClick={() => handleOccasionChange(occasion)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Mood Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Gift Mood</label>
          <Select onValueChange={handleMoodChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select mood" />
            </SelectTrigger>
            <SelectContent>
              {moods.map(mood => (
                <SelectItem key={mood} value={mood}>{mood}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filterOptions.mood && (
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100">
                {filterOptions.mood}
                <button
                  onClick={() => handleMoodChange("")}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </span>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={handleReset}>
            Reset Filters
          </Button>
          <Button onClick={() => onApplyFilters(filterOptions)}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}