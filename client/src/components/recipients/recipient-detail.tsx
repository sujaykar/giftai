import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDateToLocal, formatDaysFromNow, getInitials } from "@/lib/utils";

interface RecipientDetailProps {
  recipient: any;
  preferences: any[];
  occasions: any[];
  isLoading: {
    preferences: boolean;
    occasions: boolean;
  };
  onDelete: () => void;
}

export default function RecipientDetail({ 
  recipient, 
  preferences, 
  occasions, 
  isLoading,
  onDelete
}: RecipientDetailProps) {
  // Get specific preference values
  const interests = preferences?.find(p => p.preferenceType === "interests")?.preferenceValue || [];
  const giftPreferences = preferences?.find(p => p.preferenceType === "gift_preferences")?.preferenceValue || {};
  const notes = preferences?.find(p => p.preferenceType === "notes")?.preferenceValue || "";

  // Organize occasions by upcoming
  const sortedOccasions = [...(occasions || [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Find upcoming occasions
  const upcomingOccasions = sortedOccasions.filter(occ => 
    new Date(occ.date) > new Date()
  );

  return (
    <>
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-medium text-gray-600 mb-3">
              {getInitials(recipient.name)}
            </div>
            <h2 className="text-xl font-medium text-gray-900">{recipient.name}</h2>
            <p className="text-gray-500">{recipient.relationship}</p>
          </div>
          
          <div className="space-y-4">
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Interests & Hobbies</h3>
              {isLoading.preferences ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest: string, index: number) => (
                    <span key={index} className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No interests added yet</p>
              )}
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Gift Preferences</h3>
              {isLoading.preferences ? (
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : (
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <i className="ri-money-dollar-circle-line text-gray-400"></i>
                    <span className="text-gray-700">
                      Budget: {giftPreferences?.budget ? formatBudget(giftPreferences.budget) : "Not specified"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="ri-thumb-up-line text-gray-400"></i>
                    <span className="text-gray-700">
                      Prefers: {giftPreferences?.giftTypes?.length > 0 
                        ? giftPreferences.giftTypes.join(", ") 
                        : "Not specified"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="ri-thumb-down-line text-gray-400"></i>
                    <span className="text-gray-700">
                      Avoids: {giftPreferences?.avoidItems 
                        ? giftPreferences.avoidItems 
                        : "Not specified"}
                    </span>
                  </li>
                </ul>
              )}
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Upcoming Dates</h3>
              {isLoading.occasions ? (
                <div className="space-y-3">
                  <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : upcomingOccasions.length > 0 ? (
                <ul className="space-y-3">
                  {upcomingOccasions.slice(0, 3).map((occasion) => (
                    <li key={occasion.id} className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                        <i className="ri-calendar-event-line"></i>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{occasion.name}</p>
                        <p className="text-xs text-primary-500">
                          {formatDateToLocal(occasion.date)} ({formatDaysFromNow(occasion.date)})
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No upcoming dates added</p>
              )}
            </div>
            
            {notes && (
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Notes</h3>
                <p className="text-sm text-gray-600">{notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Danger Zone</h3>
          
          <Button variant="destructive" onClick={onDelete} className="w-full">
            <i className="ri-delete-bin-line mr-2"></i>
            Delete Recipient
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            This action cannot be undone. It will permanently delete this recipient
            and all associated data.
          </p>
        </CardContent>
      </Card>
    </>
  );
}

// Helper function to format budget display
function formatBudget(budget: string): string {
  switch (budget) {
    case 'under-25': return 'Under $25';
    case '25-50': return '$25 - $50';
    case '50-100': return '$50 - $100';
    case '100-200': return '$100 - $200';
    case '200-500': return '$200 - $500';
    case 'over-500': return 'Over $500';
    default: return budget;
  }
}
