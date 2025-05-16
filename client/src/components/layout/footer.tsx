import { Link } from "wouter";
import { GiftIcon } from "@/assets/icons/gift-icon";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/">
              <a className="flex items-center gap-2 mb-4">
                <GiftIcon className="text-primary-400 w-6 h-6" />
                <span className="font-heading font-bold text-xl text-white">GIFT AI</span>
              </a>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Let AI find the perfect gifts for your loved ones, so you can focus on creating moments that matter.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="ri-facebook-fill text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="ri-twitter-fill text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="ri-instagram-fill text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="ri-pinterest-fill text-lg"></i>
              </a>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-medium text-white mb-4">Platform</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white">How it works</a></li>
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white">Pricing</a></li>
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white">Features</a></li>
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white">FAQs</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-white mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white">About us</a></li>
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white">Careers</a></li>
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-white mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white">Help Center</a></li>
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white">Terms of Service</a></li>
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} GIFT AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
