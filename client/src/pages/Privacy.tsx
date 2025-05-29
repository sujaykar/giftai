import { Link } from "wouter";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <Link href="/" className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
            <p className="mb-6 text-gray-700">
              GIFT AI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains 
              how we collect, use, disclose, and safeguard your information when you use our AI-powered gift 
              recommendation service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
            <h3 className="text-xl font-medium text-gray-800 mb-3">Personal Information</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Name and email address (when you create an account or sign in with Google)</li>
              <li>Profile information from Google OAuth (if you choose to sign in with Google)</li>
              <li>Gift recipient information you provide (names, relationships, preferences)</li>
              <li>Occasion and event details you input</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">Usage Information</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Gift recommendations you view, save, or purchase</li>
              <li>Search queries and preferences</li>
              <li>Device information and browser type</li>
              <li>Usage patterns and interaction data</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Provide personalized gift recommendations using AI analysis</li>
              <li>Create and manage your account</li>
              <li>Send important service notifications and updates</li>
              <li>Improve our recommendation algorithms and service quality</li>
              <li>Provide customer support</li>
              <li>Analyze usage trends to enhance user experience</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Storage and Security</h2>
            <p className="mb-4 text-gray-700">
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Encrypted data transmission using SSL/TLS protocols</li>
              <li>Secure database storage with access controls</li>
              <li>Regular security audits and updates</li>
              <li>Password hashing and secure authentication</li>
              <li>Limited employee access on a need-to-know basis</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
            <p className="mb-4 text-gray-700">
              We use the following third-party services that may collect information:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li><strong>Google OAuth:</strong> For secure account authentication</li>
              <li><strong>OpenAI:</strong> For AI-powered gift recommendations (no personal data shared)</li>
              <li><strong>SendGrid:</strong> For transactional emails</li>
              <li><strong>Payment Processors:</strong> For secure payment processing (when implemented)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
            <p className="mb-4 text-gray-700">You have the right to:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Access your personal information</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Delete your account and associated data</li>
              <li>Export your data in a portable format</li>
              <li>Withdraw consent for data processing</li>
              <li>Object to certain uses of your information</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Retention</h2>
            <p className="mb-6 text-gray-700">
              We retain your personal information only as long as necessary to provide our services and 
              fulfill the purposes outlined in this policy. When you delete your account, we will remove 
              your personal information within 30 days, except where retention is required by law.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="mb-6 text-gray-700">
              Our service is not intended for children under 13. We do not knowingly collect personal 
              information from children under 13. If we become aware of such collection, we will take 
              steps to delete the information immediately.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">International Data Transfers</h2>
            <p className="mb-6 text-gray-700">
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place to protect your data in accordance with 
              this privacy policy.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
            <p className="mb-6 text-gray-700">
              We may update this Privacy Policy from time to time. We will notify you of any material 
              changes by posting the new policy on this page and updating the "Last updated" date. 
              Your continued use of our service after changes become effective constitutes acceptance 
              of the revised policy.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="mb-4 text-gray-700">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-gray-700">
                <strong>Email:</strong> privacy@giftsai.com<br />
                <strong>Mailing Address:</strong> GIFT AI Privacy Team<br />
                123 Innovation Drive<br />
                Tech City, TC 12345<br />
                United States
              </p>
            </div>

            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-gray-600">
                This privacy policy is effective as of the date listed above and applies to all users 
                of the GIFT AI service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}