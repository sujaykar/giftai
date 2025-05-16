import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import RecommendationCard from "@/components/dashboard/recommendation-card";
import { useAuth } from "@/hooks/use-auth";

export default function Recommendations() {
  const { user } = useAuth();
  const [filter, setFilter] = useState({
    recipient: "all",
    priceRange: "all",
    status: "all"
  });

  // Fetch recommendations
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['/api/recommendations'],
    enabled: !!user
  });

  // Fetch recipients for filter dropdown
  const { data: recipients } = useQuery({
    queryKey: ['/api/recipients'],
    enabled: !!user
  });

  // Filter recommendations based on selected filters
  const filteredRecommendations = recommendations ? recommendations.filter((rec: any) => {
    let matchesRecipient = filter.recipient === "all" || rec.recipientId.toString() === filter.recipient;
    
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
    
    let matchesStatus = filter.status === "all" || rec.status === filter.status;
    
    return matchesRecipient && matchesPriceRange && matchesStatus;
  }) : [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold">Gift Recommendations</h1>
          <p className="text-gray-600 mt-1">Curated gift ideas based on your recipients' preferences</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">Recipient:</span>
            <select 
              className="text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={filter.recipient}
              onChange={(e) => setFilter(prev => ({ ...prev, recipient: e.target.value }))}
            >
              <option value="all">All Recipients</option>
              {recipients?.map((recipient: any) => (
                <option key={recipient.id} value={recipient.id.toString()}>
                  {recipient.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">Price:</span>
            <select 
              className="text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={filter.priceRange}
              onChange={(e) => setFilter(prev => ({ ...prev, priceRange: e.target.value }))}
            >
              <option value="all">All Prices</option>
              <option value="under-50">Under $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100-200">$100 - $200</option>
              <option value="above-200">Above $200</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">Status:</span>
            <select 
              className="text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="viewed">Viewed</option>
              <option value="approved">Purchased</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-auto"
            onClick={() => setFilter({ recipient: "all", priceRange: "all", status: "all" })}
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
              <div className="w-full h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-4 w-20 bg-gray-200 rounded-full"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 w-full bg-gray-200 rounded mb-3"></div>
                <div className="h-20 w-full bg-gray-200 rounded mb-4"></div>
                <div className="flex space-x-2">
                  <div className="h-8 flex-1 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredRecommendations?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecommendations.map((recommendation: any) => (
            <RecommendationCard 
              key={recommendation.id}
              recommendation={recommendation}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <i className="ri-gift-line text-2xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations found</h3>
          <p className="text-gray-500 mb-4">
            {recommendations?.length > 0 
              ? "Try adjusting your filters to see more recommendations."
              : "Add recipients and complete their preference profiles to get personalized gift recommendations."}
          </p>
          {recommendations?.length === 0 && (
            <Link href="/recipients/add">
              <Button>
                <i className="ri-user-add-line mr-2"></i>
                Add a recipient
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
