import { Sparkles, Mail, MessageCircle } from "lucide-react";

export function ContactPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-pink-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                    <p className="text-gray-600 mb-2">
                      For general inquiries, technical support, or partnership opportunities:
                    </p>
                    <a 
                      href="mailto:info@giftsai.com" 
                      className="text-pink-500 hover:text-pink-600 font-medium"
                    >
                      info@giftsai.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MessageCircle className="h-6 w-6 text-pink-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Response Time</h3>
                    <p className="text-gray-600">
                      We typically respond to all inquiries within 24 hours during business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">How does GIFT AI work?</h3>
                  <p className="text-gray-600 text-sm">
                    Our AI analyzes recipient preferences and occasions to provide personalized gift recommendations.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Is my data secure?</h3>
                  <p className="text-gray-600 text-sm">
                    Yes, we use industry-standard security measures to protect your personal information.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Can I customize recommendations?</h3>
                  <p className="text-gray-600 text-sm">
                    Absolutely! You can set preferences, budgets, and provide feedback to improve suggestions.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Is there a mobile app?</h3>
                  <p className="text-gray-600 text-sm">
                    Our web platform is mobile-responsive. A dedicated mobile app is in development.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}