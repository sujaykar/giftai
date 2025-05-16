import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/dashboard/stats-card";
import RecipientCard from "@/components/dashboard/recipient-card";
import RecommendationCard from "@/components/dashboard/recommendation-card";
import OccasionTable from "@/components/dashboard/occasion-table";
import { useAuth } from "@/hooks/use-auth";

export default function Dashboard() {
  const { user } = useAuth();

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/stats'],
    enabled: !!user
  });

  // Fetch recipients
  const { data: recipients, isLoading: recipientsLoading } = useQuery({
    queryKey: ['/api/recipients'],
    enabled: !!user
  });

  // Fetch recommendations
  const { data: recommendations, isLoading: recommendationsLoading } = useQuery({
    queryKey: ['/api/recommendations'],
    enabled: !!user
  });

  // Fetch upcoming occasions
  const { data: upcomingOccasions, isLoading: occasionsLoading } = useQuery({
    queryKey: ['/api/occasions/upcoming'],
    enabled: !!user
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary-50 to-white pt-12 pb-8 md:pt-20 md:pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Discover perfect gifts <span className="text-primary">without the guesswork</span>
              </h1>
              <p className="text-gray-600 text-lg mb-6">
                Let AI find the ideal gifts for your loved ones based on their preferences, interests, and personality.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    <i className="ri-user-add-line"></i>
                  </div>
                  <p className="text-gray-700">Add friends and family to your gift list</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    <i className="ri-questionnaire-line"></i>
                  </div>
                  <p className="text-gray-700">Tell us about their preferences with a quick quiz</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    <i className="ri-gift-line"></i>
                  </div>
                  <p className="text-gray-700">Get personalized gift recommendations</p>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/recipients/add">
                  <Button size="lg">
                    Add your first recipient
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-64 md:h-auto">
              <img 
                src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
                alt="Person opening a gift" 
                className="rounded-lg shadow-xl object-cover w-full h-full" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <StatsCard 
              value={statsLoading ? '-' : stats?.recipients || 0} 
              label="Recipients" 
              loading={statsLoading}
            />
            <StatsCard 
              value={statsLoading ? '-' : stats?.recommendations || 0} 
              label="Recommendations" 
              loading={statsLoading}
            />
            <StatsCard 
              value={statsLoading ? '-' : stats?.gifts_purchased || 0} 
              label="Gifts Purchased" 
              loading={statsLoading}
            />
            <StatsCard 
              value={statsLoading ? '-' : stats?.upcoming_events || 0} 
              label="Upcoming Events" 
              loading={statsLoading}
            />
          </div>
        </div>
      </section>

      {/* Recipients Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-heading text-2xl font-bold">Your Recipients</h2>
            <Link href="/recipients">
              <a className="text-primary hover:text-primary-600 text-sm font-medium flex items-center">
                View all
                <i className="ri-arrow-right-line ml-1"></i>
              </a>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recipientsLoading ? (
              // Skeleton loading for recipients
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                      <div>
                        <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 w-16 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="h-3 w-full bg-gray-200 rounded"></div>
                    <div className="h-3 w-full bg-gray-200 rounded"></div>
                    <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="pt-4 border-t border-gray-100"></div>
                </div>
              ))
            ) : recipients?.length > 0 ? (
              // Actual recipient cards
              recipients.slice(0, 3).map((recipient) => (
                <RecipientCard 
                  key={recipient.id}
                  recipient={recipient}
                />
              ))
            ) : null}
            
            {/* Add New Recipient Card */}
            <Link href="/recipients/add">
              <a className="bg-gray-50 rounded-xl border border-dashed border-gray-300 hover:border-primary-300 hover:bg-gray-100 transition-colors">
                <div className="w-full h-full p-6 flex flex-col items-center justify-center text-gray-500 hover:text-primary-500">
                  <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-3">
                    <i className="ri-user-add-line text-xl"></i>
                  </div>
                  <p className="font-medium text-sm">Add new recipient</p>
                </div>
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Recommendations Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-heading text-2xl font-bold">Top Gift Recommendations</h2>
            <Link href="/recommendations">
              <a className="text-primary hover:text-primary-600 text-sm font-medium flex items-center">
                View all recommendations
                <i className="ri-arrow-right-line ml-1"></i>
              </a>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recommendationsLoading ? (
              // Skeleton loading for recommendations
              Array.from({ length: 4 }).map((_, index) => (
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
              ))
            ) : recommendations?.length > 0 ? (
              // Actual recommendation cards
              recommendations.slice(0, 4).map((recommendation) => (
                <RecommendationCard 
                  key={recommendation.id}
                  recommendation={recommendation}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-gift-line text-2xl text-gray-400"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations yet</h3>
                <p className="text-gray-500 mb-4">Add recipients and complete their preference profile to get personalized gift recommendations.</p>
                <Link href="/recipients/add">
                  <Button>Add a recipient</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-2xl font-bold mb-8">Upcoming Gift Occasions</h2>
          
          <OccasionTable occasions={upcomingOccasions || []} loading={occasionsLoading} />
        </div>
      </section>
    </div>
  );
}
