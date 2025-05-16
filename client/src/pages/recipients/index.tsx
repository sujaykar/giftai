import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import RecipientCard from "@/components/dashboard/recipient-card";
import { useAuth } from "@/hooks/use-auth";

export default function Recipients() {
  const { user } = useAuth();

  // Fetch recipients
  const { data: recipients, isLoading } = useQuery({
    queryKey: ['/api/recipients'],
    enabled: !!user
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold">Your Recipients</h1>
          <p className="text-gray-600 mt-1">Manage your friends and family for gift recommendations</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/recipients/add">
            <Button>
              <i className="ri-user-add-line mr-2"></i>
              Add Recipient
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
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
          ))}
        </div>
      ) : recipients?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recipients.map((recipient) => (
            <RecipientCard 
              key={recipient.id}
              recipient={recipient}
              showViewButton
            />
          ))}
          
          {/* Add New Recipient Card */}
          <Link href="/recipients/add">
            <a className="bg-gray-50 rounded-xl border border-dashed border-gray-300 hover:border-primary-300 hover:bg-gray-100 transition-colors h-full">
              <div className="w-full h-full p-6 flex flex-col items-center justify-center text-gray-500 hover:text-primary-500">
                <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-3">
                  <i className="ri-user-add-line text-xl"></i>
                </div>
                <p className="font-medium text-sm">Add new recipient</p>
              </div>
            </a>
          </Link>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <i className="ri-user-add-line text-2xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recipients yet</h3>
          <p className="text-gray-500 mb-4">Add friends and family to get personalized gift recommendations.</p>
          <Link href="/recipients/add">
            <Button>
              <i className="ri-user-add-line mr-2"></i>
              Add your first recipient
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
