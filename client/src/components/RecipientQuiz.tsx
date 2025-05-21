import React, { useState } from 'react';

interface RecipientQuizProps {
  onComplete: (recipientData: RecipientData) => void;
  onCancel: () => void;
}

interface RecipientData {
  name: string;
  relationship: string;
  age: number;
  gender: string;
  interests: string[];
  occasions: { name: string; date: string }[];
  budget: number;
  preferences: {
    categories: string[];
    colors: string[];
    styles: string[];
  };
}

export function RecipientQuiz({ onComplete, onCancel }: RecipientQuizProps) {
  const [step, setStep] = useState(1);
  const [recipientData, setRecipientData] = useState<RecipientData>({
    name: '',
    relationship: '',
    age: 30,
    gender: '',
    interests: [],
    occasions: [],
    budget: 100,
    preferences: {
      categories: [],
      colors: [],
      styles: [],
    }
  });

  const totalSteps = 6;

  const updateData = (update: Partial<RecipientData>) => {
    setRecipientData(prev => ({ ...prev, ...update }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(recipientData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onCancel();
    }
  };

  const handleInterestToggle = (interest: string) => {
    const updated = recipientData.interests.includes(interest)
      ? recipientData.interests.filter(i => i !== interest)
      : [...recipientData.interests, interest];
    
    updateData({ interests: updated });
  };

  const handleCategoryToggle = (category: string) => {
    const updated = recipientData.preferences.categories.includes(category)
      ? recipientData.preferences.categories.filter(c => c !== category)
      : [...recipientData.preferences.categories, category];
    
    updateData({ 
      preferences: { 
        ...recipientData.preferences, 
        categories: updated 
      } 
    });
  };

  const handleAddOccasion = () => {
    const newOccasion = { 
      name: 'Birthday', 
      date: new Date().toISOString().split('T')[0] 
    };
    
    updateData({ 
      occasions: [...recipientData.occasions, newOccasion] 
    });
  };

  const handleRemoveOccasion = (index: number) => {
    const updated = [...recipientData.occasions];
    updated.splice(index, 1);
    updateData({ occasions: updated });
  };

  const updateOccasion = (index: number, field: 'name' | 'date', value: string) => {
    const updated = [...recipientData.occasions];
    updated[index] = { ...updated[index], [field]: value };
    updateData({ occasions: updated });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipient's Name</label>
              <input
                type="text"
                value={recipientData.name}
                onChange={(e) => updateData({ name: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Relationship</label>
              <select
                value={recipientData.relationship}
                onChange={(e) => updateData({ relationship: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              >
                <option value="">Select relationship</option>
                <option value="Friend">Friend</option>
                <option value="Family">Family</option>
                <option value="Partner">Partner</option>
                <option value="Colleague">Colleague</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                value={recipientData.age}
                onChange={(e) => updateData({ age: parseInt(e.target.value) || 0 })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                placeholder="Enter age"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={recipientData.gender}
                onChange={(e) => updateData({ gender: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">What are their interests?</label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {['Reading', 'Cooking', 'Gaming', 'Travel', 'Sports', 'Music', 'Art', 'Technology', 
                'Fashion', 'Fitness', 'Movies', 'Outdoors', 'Photography', 'Gardening', 'Writing'].map(interest => (
                <div 
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`cursor-pointer rounded-lg border p-3 text-center ${
                    recipientData.interests.includes(interest) 
                      ? 'border-pink-500 bg-pink-50 text-pink-700' 
                      : 'border-gray-200 hover:border-pink-200'
                  }`}
                >
                  {interest}
                </div>
              ))}
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">Special Occasions</label>
            <div className="space-y-3">
              {recipientData.occasions.map((occasion, index) => (
                <div key={index} className="flex items-center gap-3 border rounded-md p-3">
                  <select
                    value={occasion.name}
                    onChange={(e) => updateOccasion(index, 'name', e.target.value)}
                    className="w-1/2 rounded-md border border-gray-300 px-3 py-2 focus:border-pink-500 focus:outline-none"
                  >
                    <option value="Birthday">Birthday</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Christmas">Christmas</option>
                    <option value="Valentine's Day">Valentine's Day</option>
                    <option value="Graduation">Graduation</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    type="date"
                    value={occasion.date}
                    onChange={(e) => updateOccasion(index, 'date', e.target.value)}
                    className="w-1/2 rounded-md border border-gray-300 px-3 py-2 focus:border-pink-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleRemoveOccasion(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddOccasion}
                className="flex w-full items-center justify-center rounded-md border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-600 hover:border-pink-500 hover:text-pink-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Add Occasion
              </button>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">Gift Preferences</label>
            <div>
              <p className="text-sm text-gray-600 mb-2">What gift categories do they enjoy?</p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {['Technology', 'Clothing', 'Home', 'Experiences', 'Food & Drink', 'Books', 'Beauty', 'Sports', 'Handmade'].map(category => (
                  <div 
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`cursor-pointer rounded-lg border p-3 text-center ${
                      recipientData.preferences.categories.includes(category) 
                        ? 'border-pink-500 bg-pink-50 text-pink-700' 
                        : 'border-gray-200 hover:border-pink-200'
                    }`}
                  >
                    {category}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 6:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gift Budget</label>
              <div className="flex items-center">
                <span className="mr-2 text-gray-500">$</span>
                <input
                  type="number"
                  value={recipientData.budget}
                  onChange={(e) => updateData({ budget: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  placeholder="Enter budget"
                />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Review Recipient Information:</p>
              <div className="space-y-2 rounded-md bg-gray-50 p-4">
                <p><span className="font-medium">Name:</span> {recipientData.name}</p>
                <p><span className="font-medium">Relationship:</span> {recipientData.relationship}</p>
                <p><span className="font-medium">Age:</span> {recipientData.age}</p>
                <p><span className="font-medium">Gender:</span> {recipientData.gender}</p>
                <p><span className="font-medium">Interests:</span> {recipientData.interests.join(', ')}</p>
                <p><span className="font-medium">Occasions:</span> {recipientData.occasions.map(o => `${o.name} (${o.date})`).join(', ')}</p>
                <p><span className="font-medium">Categories:</span> {recipientData.preferences.categories.join(', ')}</p>
                <p><span className="font-medium">Budget:</span> ${recipientData.budget}</p>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add New Recipient</h2>
            <button 
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Step {step} of {totalSteps}</span>
              <span className="text-sm font-medium text-pink-500">{Math.round((step / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div 
                className="h-full rounded-full bg-pink-500" 
                style={{ width: `${(step / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="min-h-[300px]">
            {renderStep()}
          </div>
          
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              className="px-5 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium text-base"
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-pink-500 rounded-md text-white hover:bg-pink-600 font-medium text-base shadow-md"
              disabled={step === 1 && (!recipientData.name || !recipientData.relationship)}
            >
              {step === totalSteps ? 'Complete' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}