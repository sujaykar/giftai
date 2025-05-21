import React, { useState } from 'react';
import { RecipientQuiz } from '../components/RecipientQuiz';

interface Recipient {
  id: number;
  name: string;
  relationship: string;
  age: number;
  gender: string;
  imageUrl: string;
  interests: string[];
  occasions: { name: string; date: string }[];
  budget: number;
}

export function RecipientsPage() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [recipients, setRecipients] = useState<Recipient[]>([
    {
      id: 1,
      name: "Emma Thompson",
      relationship: "Friend",
      age: 27,
      gender: "Female",
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=150&q=80",
      interests: ["Reading", "Hiking", "Photography"],
      occasions: [{ name: "Birthday", date: "2025-03-15" }],
      budget: 350
    },
    {
      id: 2,
      name: "Michael Chen",
      relationship: "Friend",
      age: 32,
      gender: "Male",
      imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=150&q=80",
      interests: ["Cooking", "Gaming", "Travel"],
      occasions: [{ name: "Christmas", date: "2024-12-25" }],
      budget: 400
    },
    {
      id: 3,
      name: "Sarah Johnson",
      relationship: "Colleague",
      age: 35,
      gender: "Female",
      imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=150&q=80",
      interests: ["Fitness", "Music", "Art"],
      occasions: [{ name: "Birthday", date: "2025-06-10" }],
      budget: 250
    }
  ]);

  const handleAddRecipient = (recipientData: any) => {
    const newRecipient = {
      id: recipients.length + 1,
      name: recipientData.name,
      relationship: recipientData.relationship,
      age: recipientData.age,
      gender: recipientData.gender,
      imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(recipientData.name)}&background=random`,
      interests: recipientData.interests,
      occasions: recipientData.occasions,
      budget: recipientData.budget
    };
    
    setRecipients([...recipients, newRecipient]);
    setShowQuiz(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Your Recipients</h1>
      <p className="text-gray-600">Manage your gift recipients and their preferences.</p>
      
      {/* Recipients list */}
      <div className="flex justify-end">
        <button 
          onClick={() => setShowQuiz(true)}
          className="bg-pink-500 text-white px-4 py-2 rounded-md flex items-center gap-1 hover:bg-pink-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Recipient
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recipients.map(recipient => (
          <div key={recipient.id} className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
            <div className="h-40 bg-gray-100">
              <img 
                src={recipient.imageUrl} 
                alt={recipient.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{recipient.name}</h3>
              <p className="text-sm text-gray-500">
                {recipient.relationship} • {recipient.age} years
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {recipient.interests.map(interest => (
                  <span key={interest} className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs font-medium">
                    {interest}
                  </span>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Next occasion:</span>{' '}
                  {recipient.occasions[0]?.name} on {new Date(recipient.occasions[0]?.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Budget:</span> ${recipient.budget}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {showQuiz && (
        <RecipientQuiz 
          onComplete={handleAddRecipient} 
          onCancel={() => setShowQuiz(false)} 
        />
      )}
    </div>
  );
}