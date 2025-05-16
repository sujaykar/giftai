import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";

interface RecipientCardProps {
  recipient: any;
  showViewButton?: boolean;
}

export default function RecipientCard({ recipient, showViewButton = false }: RecipientCardProps) {
  // Get preferences if they exist
  const interests = recipient.preferences?.find((p: any) => p.preferenceType === "interests")?.preferenceValue || [];
  const nextEvent = recipient.occasions?.length > 0 
    ? recipient.occasions.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
    : null;
  const budgetPref = recipient.preferences?.find((p: any) => p.preferenceType === "gift_preferences")?.preferenceValue?.budget || null;
  
  // Format for interests display
  const interestsString = Array.isArray(interests) 
    ? interests.slice(0, 3).join(", ") + (interests.length > 3 ? "..." : "")
    : "";
  
  // Format next event display
  const eventDisplay = nextEvent 
    ? `${nextEvent.name}: ${new Date(nextEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`
    : "No upcoming events";
  
  // Format budget display
  const budgetDisplay = budgetPref ? budgetPref : "Not specified";

  // Count recommendations
  const recommendationsCount = recipient.recommendationsCount || 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-medium text-gray-600">
              {getInitials(recipient.name)}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{recipient.name}</h3>
              <p className="text-sm text-gray-500">{recipient.relationship}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-400 hover:text-gray-500">
                <i className="ri-more-2-fill"></i>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/recipients/${recipient.id}`}>
                  <a className="cursor-pointer w-full">
                    <i className="ri-eye-line mr-2"></i>
                    View details
                  </a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/recipients/${recipient.id}/edit`}>
                  <a className="cursor-pointer w-full">
                    <i className="ri-edit-line mr-2"></i>
                    Edit recipient
                  </a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/recipients/quiz?id=${recipient.id}`}>
                  <a className="cursor-pointer w-full">
                    <i className="ri-questionnaire-line mr-2"></i>
                    Edit preferences
                  </a>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm">
            <i className="ri-heart-3-line text-gray-400 mr-2"></i>
            <span className="text-gray-600">
              {interestsString || "No interests added yet"}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <i className="ri-calendar-line text-gray-400 mr-2"></i>
            <span className="text-gray-600">{eventDisplay}</span>
          </div>
          <div className="flex items-center text-sm">
            <i className="ri-money-dollar-circle-line text-gray-400 mr-2"></i>
            <span className="text-gray-600">{budgetDisplay}</span>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-100 flex justify-between">
          <Link href={`/recipients/quiz?id=${recipient.id}`}>
            <a className="text-gray-600 text-sm hover:text-primary inline-flex items-center">
              Edit preferences
              <i className="ri-edit-line ml-1"></i>
            </a>
          </Link>
          
          {showViewButton ? (
            <Link href={`/recipients/${recipient.id}`}>
              <a className="text-sm text-primary hover:text-primary-600 inline-flex items-center">
                View details
                <i className="ri-arrow-right-line ml-1"></i>
              </a>
            </Link>
          ) : (
            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
              {recommendationsCount} recommendations
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
