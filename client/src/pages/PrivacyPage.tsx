import { Sparkles } from "lucide-react";

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-pink-500" />
            <span className="text-2xl font-bold text-pink-500">GIFT AI</span>
          </div>
          <a 
            href="/"
            className="text-gray-600 hover:text-pink-500 font-medium transition-colors"
          >
            Back to Home
          </a>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>Account Information:</strong> When you create an account, we collect your name, 
                  email address, and authentication credentials.
                </p>
                <p>
                  <strong>Recipient Data:</strong> Information you provide about gift recipients, including 
                  their preferences, interests, and relationship to you.
                </p>
                <p>
                  <strong>Usage Data:</strong> How you interact with our platform, including pages visited, 
                  features used, and recommendation feedback.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>Personalized Recommendations:</strong> We use recipient information and your 
                  preferences to provide tailored gift suggestions.
                </p>
                <p>
                  <strong>Service Improvement:</strong> Usage data helps us enhance our AI algorithms 
                  and improve the overall user experience.
                </p>
                <p>
                  <strong>Communication:</strong> We may send you service updates, recommendations, 
                  and support communications via email.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We implement industry-standard security measures to protect your personal information, 
                  including encryption, secure data transmission, and access controls.
                </p>
                <p>
                  Your data is stored securely and is only accessible by authorized personnel who need 
                  it to provide our services.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We do not sell, trade, or rent your personal information to third parties. We may 
                  share information only in the following circumstances:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>With your explicit consent</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and safety</li>
                  <li>With service providers who help us operate our platform</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>Access:</strong> You can view and download your personal data at any time.
                </p>
                <p>
                  <strong>Correction:</strong> You can update or correct your information through your account settings.
                </p>
                <p>
                  <strong>Deletion:</strong> You can request deletion of your account and associated data.
                </p>
                <p>
                  <strong>Portability:</strong> You can request a copy of your data in a machine-readable format.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies and Tracking</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We use cookies and similar technologies to enhance your experience, remember your 
                  preferences, and analyze how our service is used.
                </p>
                <p>
                  You can control cookie settings through your browser preferences, though some 
                  features may not function properly without them.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  If you have questions about this Privacy Policy or how we handle your data, 
                  please contact us at:
                </p>
                <p>
                  <strong>Email:</strong> <a href="mailto:info@giftsai.com" className="text-pink-500 hover:text-pink-600">info@giftsai.com</a>
                </p>
                <p className="text-sm">
                  <strong>Last updated:</strong> January 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}