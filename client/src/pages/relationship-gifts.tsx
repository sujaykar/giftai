import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Heart, ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RelationshipGiftSuggestions } from '../components/relationship-gift-suggestions';

export default function RelationshipGiftsPage() {
  const [location, setLocation] = useLocation();
  const [selectedRecipientId, setSelectedRecipientId] = useState<number | null>(null);

  // Fetch recipients
  const {
    data: recipients,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['/api/recipients'],
  });

  // Handle recipient selection
  const handleRecipientChange = (recipientId: string) => {
    setSelectedRecipientId(Number(recipientId));
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relationship-Based Gift Suggestions</h1>
          <p className="text-muted-foreground mt-1">
            Get personalized gift ideas based on your unique relationship dynamics.
          </p>
        </div>
        <Button variant="outline" onClick={() => setLocation('/dashboard')}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select a Recipient</CardTitle>
          <CardDescription>
            Choose a recipient to get personalized gift suggestions based on your relationship.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading recipients...</span>
            </div>
          ) : error ? (
            <p className="text-red-500">Error loading recipients. Please try again.</p>
          ) : recipients?.length > 0 ? (
            <div className="max-w-md">
              <Select
                value={selectedRecipientId?.toString()}
                onValueChange={handleRecipientChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a recipient" />
                </SelectTrigger>
                <SelectContent>
                  {recipients.map((recipient: any) => (
                    <SelectItem key={recipient.id} value={recipient.id.toString()}>
                      {recipient.name} ({recipient.relationship})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Recipients Found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                You need to add recipients before you can get relationship-based gift suggestions.
              </p>
              <Button
                onClick={() => setLocation('/recipients/new')}
                className="mt-4"
                variant="outline"
              >
                Add a Recipient
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Render the relationship gift suggestions component when a recipient is selected */}
      {selectedRecipientId && (
        <RelationshipGiftSuggestions recipientId={selectedRecipientId} />
      )}
    </div>
  );
}