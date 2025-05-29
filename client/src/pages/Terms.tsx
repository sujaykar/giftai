import { Link } from "wouter";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <Link href="/" className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
            <p className="mb-6 text-gray-700">
              By accessing and using GIFT AI ("Service"), you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by these Terms of Service, 
              please do not use this service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description of Service</h2>
            <p className="mb-6 text-gray-700">
              GIFT AI is an AI-powered gift recommendation platform that helps users find personalized 
              gift suggestions based on recipient preferences, occasions, and other contextual factors. 
              Our service uses artificial intelligence to analyze user inputs and provide tailored recommendations.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Accounts</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>You must provide accurate and complete registration information</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You are responsible for all activities that occur under your account</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
              <li>You must be at least 13 years old to create an account</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptable Use</h2>
            <p className="mb-4 text-gray-700">You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Transmit harmful, threatening, or inappropriate content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use the service for commercial purposes without authorization</li>
              <li>Submit false or misleading information</li>
              <li>Interfere with or disrupt the service or servers</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">AI Recommendations</h2>
            <p className="mb-4 text-gray-700">
              Our AI-powered recommendations are provided for informational purposes only:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Recommendations are based on the information you provide</li>
              <li>We do not guarantee the accuracy or suitability of recommendations</li>
              <li>Final purchasing decisions are entirely your responsibility</li>
              <li>We are not liable for any outcomes related to gift purchases</li>
              <li>Recommendations may include affiliate links for which we receive compensation</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
            <p className="mb-6 text-gray-700">
              The Service and its original content, features, and functionality are owned by GIFT AI 
              and are protected by international copyright, trademark, patent, trade secret, and other 
              intellectual property laws. You retain ownership of any content you submit to the Service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy and Data</h2>
            <p className="mb-6 text-gray-700">
              Your privacy is important to us. Please review our Privacy Policy, which also governs 
              your use of the Service, to understand our practices regarding the collection and use 
              of your personal information.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
            <p className="mb-6 text-gray-700">
              Our Service may contain links to third-party websites or services that are not owned 
              or controlled by GIFT AI. We have no control over and assume no responsibility for the 
              content, privacy policies, or practices of any third-party websites or services.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Disclaimers</h2>
            <p className="mb-4 text-gray-700">
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>We make no warranties regarding the reliability, accuracy, or availability of the Service</li>
              <li>We disclaim all warranties, express or implied, including merchantability and fitness for purpose</li>
              <li>We do not warrant that the Service will be uninterrupted or error-free</li>
              <li>Your use of the Service is at your own risk</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="mb-6 text-gray-700">
              In no event shall GIFT AI, its directors, employees, partners, agents, suppliers, or 
              affiliates be liable for any indirect, incidental, special, consequential, or punitive 
              damages, including without limitation, loss of profits, data, use, goodwill, or other 
              intangible losses, resulting from your use of the Service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
            <p className="mb-6 text-gray-700">
              We may terminate or suspend your account and bar access to the Service immediately, 
              without prior notice or liability, under our sole discretion, for any reason whatsoever 
              and without limitation, including but not limited to a breach of the Terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="mb-6 text-gray-700">
              We reserve the right to modify or replace these Terms at any time. If a revision is 
              material, we will provide at least 30 days notice prior to any new terms taking effect. 
              What constitutes a material change will be determined at our sole discretion.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law</h2>
            <p className="mb-6 text-gray-700">
              These Terms shall be interpreted and governed by the laws of the United States, without 
              regard to its conflict of law provisions. Our failure to enforce any right or provision 
              of these Terms will not be considered a waiver of those rights.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <p className="mb-4 text-gray-700">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-gray-700">
                <strong>Email:</strong> legal@giftsai.com<br />
                <strong>Mailing Address:</strong> GIFT AI Legal Department<br />
                123 Innovation Drive<br />
                Tech City, TC 12345<br />
                United States
              </p>
            </div>

            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-gray-600">
                By using our Service, you acknowledge that you have read and understood these Terms 
                of Service and agree to be bound by them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}