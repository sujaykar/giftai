import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-pink-500" />
              <span className="text-2xl font-bold text-pink-500">GIFT AI</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              AI-powered gift recommendations that help you find the perfect present for everyone on your list.
            </p>
            <p className="text-gray-400 text-sm">
              Making gift-giving meaningful and stress-free.
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="/about" className="hover:text-pink-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-pink-400 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/how-it-works" className="hover:text-pink-400 transition-colors">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="/help" className="hover:text-pink-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-pink-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="mailto:info@giftsai.com" className="hover:text-pink-400 transition-colors">
                  Email Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 GIFT AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}