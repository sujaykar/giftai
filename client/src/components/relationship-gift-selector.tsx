import React, { useState } from 'react';
import { apiRequest } from '../lib/queryClient';

interface RelationshipGiftSelectorProps {
  onRecommendationsReceived: (recommendations: any[]) => void;
}

export function RelationshipGiftSelector({ onRecommendationsReceived }: RelationshipGiftSelectorProps) {
  const [selectedRecipient, setSelectedRecipient] = useState<string>('');
  const [selectedRelationship, setSelectedRelationship] = useState<string>('');
  const [budget, setBudget] = useState<number>(50);
  const [mood, setMood] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Mock recipients - in a real app, these would be fetched from the API
  const recipients = [
    { id: '1', name: 'John Smith', relationship: 'friend' },
    { id: '2', name: 'Sarah Johnson', relationship: 'family' },
    { id: '3', name: 'Michael Brown', relationship: 'colleague' },
  ];
  
  const relationships = [
    { id: 'friend', name: 'Friend', description: 'A casual or close friendship', icon: '👥' },
    { id: 'family', name: 'Family', description: 'Parent, sibling, or other relative', icon: '👨‍👩‍👧‍👦' },
    { id: 'romantic', name: 'Romantic', description: 'Partner, spouse, or significant other', icon: '❤️' },
    { id: 'professional', name: 'Professional', description: 'Co-worker, client, or boss', icon: '💼' },
    { id: 'acquaintance', name: 'Acquaintance', description: 'Someone you know but not closely', icon: '🤝' },
  ];
  
  const moodOptions = [
    { id: "thoughtful", name: "Thoughtful", description: "Meaningful gifts that show you care", emoji: "💭" },
    { id: "fun", name: "Fun", description: "Playful gifts for joy and laughter", emoji: "🎮" },
    { id: "romantic", name: "Romantic", description: "Intimate gifts to express love", emoji: "❤️" },
    { id: "practical", name: "Practical", description: "Useful gifts for everyday life", emoji: "🔧" },
    { id: "luxurious", name: "Luxurious", description: "High-end gifts for special occasions", emoji: "✨" },
    { id: "creative", name: "Creative", description: "Artistic gifts to inspire", emoji: "🎨" },
    { id: "nostalgic", name: "Nostalgic", description: "Gifts that bring back memories", emoji: "📷" },
    { id: "relaxing", name: "Relaxing", description: "Gifts for stress relief and comfort", emoji: "🧘" }
  ];
  
  const handleGenerateRecommendations = async () => {
    if (!selectedRecipient || !selectedRelationship || !budget) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const recipientDetails = recipients.find(r => r.id === selectedRecipient);
      
      const response = await apiRequest('/api/recommendations/relationship', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientId: selectedRecipient,
          relationship: selectedRelationship,
          budget: budget,
          mood: mood || undefined,
          recipientDetails: {
            age: 30, // mock data, should be retrieved from the API
            gender: 'unspecified', // mock data, should be retrieved from the API
            interests: ['Technology', 'Reading', 'Travel'] // mock data, should be retrieved from the API
          }
        })
      }) as any;
      
      onRecommendationsReceived(response.recommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setError('Failed to generate recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">AI-Powered Gift Suggestions</h3>
        <p className="mt-1 text-sm text-gray-500">
          Use our AI to recommend gifts based on your relationship with the recipient
        </p>
      </div>
      
      <div className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 p-4 rounded-md text-sm text-red-600">
            {error}
          </div>
        )}
        
        {/* Recipient Selection */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Select Recipient
          </label>
          <select
            value={selectedRecipient}
            onChange={(e) => setSelectedRecipient(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="">Select a recipient...</option>
            {recipients.map((recipient) => (
              <option key={recipient.id} value={recipient.id}>
                {recipient.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Relationship Type */}
        <div>
          <label className="block mb-3 text-sm font-medium text-gray-700">
            Relationship Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {relationships.map((relationship) => (
              <button
                key={relationship.id}
                type="button"
                onClick={() => setSelectedRelationship(relationship.id)}
                className={`flex flex-col items-center justify-center p-3 border rounded-lg ${
                  selectedRelationship === relationship.id
                    ? 'bg-pink-50 border-pink-200 text-pink-700'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl mb-1">{relationship.icon}</span>
                <span className="text-sm font-medium">{relationship.name}</span>
                <span className="text-xs text-gray-500 text-center mt-1 line-clamp-2">
                  {relationship.description}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Budget Slider */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Budget: ${budget}
          </label>
          <div className="flex flex-col space-y-2">
            <input
              type="range"
              min="10"
              max="500"
              step="5"
              value={budget}
              onChange={(e) => setBudget(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>$10</span>
              <span>$500</span>
            </div>
          </div>
        </div>
        
        {/* Mood Selection */}
        <div>
          <label className="block mb-3 text-sm font-medium text-gray-700">
            Gift Mood (Optional)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {moodOptions.map((moodOption) => (
              <button
                key={moodOption.id}
                type="button"
                onClick={() => setMood(mood === moodOption.id ? '' : moodOption.id)}
                className={`flex flex-col items-center justify-center rounded-lg p-3 transition-colors ${
                  mood === moodOption.id 
                    ? "bg-gradient-to-br from-pink-50 to-indigo-50 border border-pink-200" 
                    : "bg-white border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span className="text-2xl mb-1">{moodOption.emoji}</span>
                <span className={`text-sm font-medium ${
                  mood === moodOption.id ? "text-pink-700" : "text-gray-700"
                }`}>{moodOption.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 flex justify-end">
        <button
          type="button"
          onClick={handleGenerateRecommendations}
          disabled={loading}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500'
          }`}
        >
          {loading ? 'Generating...' : 'Get AI Recommendations'}
        </button>
      </div>
    </div>
  );
}