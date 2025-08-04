"use client"

import { FaUserSecret, FaDatabase, FaShieldAlt, FaEye, FaTrash, FaEnvelope } from "react-icons/fa"

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <FaUserSecret className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          <p className="text-gray-600 mt-2">Your privacy and vote secrecy are fundamental to our democratic process.</p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Commitment to Your Privacy</h2>
          <p className="text-gray-600 mb-4">
            SecureVote is committed to protecting your privacy and ensuring the secrecy of your vote. This Privacy
            Policy explains how we collect, use, protect, and handle your personal information when you use our online
            voting platform.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="text-blue-700 font-medium">
              <strong>Key Promise:</strong> Your vote is completely anonymous. We cannot and will never link your
              identity to your vote choices.
            </p>
          </div>
        </div>

        {/* Information We Collect */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <FaDatabase className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Registration Information</h3>
              <p className="text-gray-600 mb-2">To verify your eligibility to vote, we collect:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>
                  <strong>Personal Details:</strong> Full name, date of birth, email address, phone number
                </li>
                <li>
                  <strong>Government ID:</strong> Passport or driver's license number, place of issue, expiry date
                </li>
                <li>
                  <strong>Address:</strong> Complete residential address for voter eligibility verification
                </li>
                <li>
                  <strong>Account Security:</strong> Encrypted password and login credentials
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Voting Information</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 mb-2">
                  <strong>Anonymous Vote Data:</strong> Your actual vote choices are completely separated from your
                  identity.
                </p>
                <ul className="list-disc list-inside text-green-700 space-y-1 ml-4">
                  <li>Vote choices are encrypted and anonymized</li>
                  <li>No direct link between your identity and your vote</li>
                  <li>Votes are processed in batches to prevent timing analysis</li>
                  <li>Only aggregate results are published</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Information</h3>
              <p className="text-gray-600 mb-2">For security and system improvement:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>IP address and browser information (for security monitoring)</li>
                <li>Login timestamps and session data</li>
                <li>Device information for fraud prevention</li>
                <li>System logs for audit and security purposes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How We Use Information */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <FaShieldAlt className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Voter Verification</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Verify your eligibility to vote</li>
                <li>Prevent duplicate registrations</li>
                <li>Ensure one person, one vote</li>
                <li>Comply with election laws</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Security & Fraud Prevention</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Detect and prevent fraudulent activity</li>
                <li>Monitor for security threats</li>
                <li>Protect against vote manipulation</li>
                <li>Maintain system integrity</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Communication</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Send account verification emails</li>
                <li>Notify about election schedules</li>
                <li>Provide important security updates</li>
                <li>Send system maintenance notices</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Legal Compliance</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Comply with election regulations</li>
                <li>Respond to legal requests</li>
                <li>Maintain audit trails</li>
                <li>Support election integrity investigations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Vote Anonymity */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <FaEye className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Vote Anonymity Guarantee</h2>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">🔒 Your Vote is Secret</h3>
            <p className="text-yellow-700">
              We use advanced cryptographic techniques to ensure that your vote choices cannot be linked to your
              identity, even by our own administrators or government officials.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Implementation</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>
                  <strong>Cryptographic Separation:</strong> Vote data is encrypted with keys separate from identity
                  data
                </li>
                <li>
                  <strong>Anonymous Tokens:</strong> Each vote is assigned a random, untraceable token
                </li>
                <li>
                  <strong>Batch Processing:</strong> Votes are processed in groups to prevent timing correlation
                </li>
                <li>
                  <strong>Zero-Knowledge Proofs:</strong> We can verify vote validity without seeing vote content
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What We Cannot See</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Which candidate you voted for</li>
                <li>How you voted on any ballot measure</li>
                <li>Your voting patterns across elections</li>
                <li>Any connection between your identity and your vote choices</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Protection */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Protect Your Data</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Encryption</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>AES-256 encryption for all stored data</li>
                <li>TLS 1.3 for data transmission</li>
                <li>End-to-end encryption for votes</li>
                <li>Encrypted database backups</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Access Controls</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Role-based access permissions</li>
                <li>Multi-factor authentication for staff</li>
                <li>Regular access reviews and audits</li>
                <li>Principle of least privilege</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Infrastructure Security</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Secure cloud hosting with SOC 2 compliance</li>
                <li>Regular security assessments</li>
                <li>Intrusion detection systems</li>
                <li>24/7 security monitoring</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Minimization</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Collect only necessary information</li>
                <li>Regular data purging schedules</li>
                <li>Anonymization where possible</li>
                <li>Secure data disposal methods</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Sharing */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Sharing and Disclosure</h2>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-medium">
              <strong>We do not sell your personal information.</strong> We do not share your data with third parties
              for marketing or commercial purposes.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Limited Sharing Scenarios</h3>
              <p className="text-gray-600 mb-2">We may share information only in these specific circumstances:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>
                  <strong>Legal Requirements:</strong> When required by law, court order, or government request
                </li>
                <li>
                  <strong>Election Officials:</strong> Aggregate voting statistics (never individual votes or
                  identities)
                </li>
                <li>
                  <strong>Security Threats:</strong> To prevent fraud or protect system integrity
                </li>
                <li>
                  <strong>Service Providers:</strong> Trusted partners who help operate our service (under strict
                  contracts)
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What We Never Share</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Your individual vote choices</li>
                <li>Your personal information for marketing</li>
                <li>Your voting history or patterns</li>
                <li>Any data that could identify how you voted</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Your Rights */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <FaTrash className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Your Privacy Rights</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Access and Control</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>View your personal information</li>
                <li>Update incorrect information</li>
                <li>Download your data</li>
                <li>Request account deletion</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Communication Preferences</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Opt out of non-essential emails</li>
                <li>Choose notification preferences</li>
                <li>Control marketing communications</li>
                <li>Set security alert preferences</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700">
              <strong>Important Note:</strong> While you can request deletion of your personal information, we may need
              to retain some data for legal compliance and election integrity purposes. Your vote data remains anonymous
              and cannot be deleted individually.
            </p>
          </div>
        </div>

        {/* Data Retention */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Retention</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Retention Periods</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>
                  <strong>Personal Information:</strong> Retained while your account is active, plus 7 years for legal
                  compliance
                </li>
                <li>
                  <strong>Vote Data:</strong> Anonymous vote records retained permanently for historical and audit
                  purposes
                </li>
                <li>
                  <strong>Security Logs:</strong> Retained for 2 years for security monitoring and investigation
                </li>
                <li>
                  <strong>Communication Records:</strong> Retained for 3 years for customer service purposes
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Deletion</h3>
              <p className="text-gray-600">
                When data is deleted, we use secure deletion methods to ensure it cannot be recovered. This includes
                overwriting data multiple times and destroying physical storage media when necessary.
              </p>
            </div>
          </div>
        </div>

        {/* Contact and Updates */}
        <div className="bg-primary text-white rounded-lg p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <FaEnvelope className="h-8 w-8 mr-3" />
            <h2 className="text-2xl font-bold">Privacy Questions or Concerns?</h2>
          </div>
          <p className="text-lg mb-6">
            Our privacy team is here to help you understand and exercise your privacy rights.
          </p>
          <div className="space-y-2 mb-6">
            <p>
              Email:{" "}
              <a href="mailto:privacy@securevote.com" className="underline">
                privacy@securevote.com
              </a>
            </p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Address: 123 Democracy Street, Vote City, VC 12345</p>
          </div>

          <div className="border-t border-blue-400 pt-6">
            <h3 className="text-lg font-semibold mb-2">Policy Updates</h3>
            <p className="text-sm">
              We will notify you of any material changes to this Privacy Policy via email and by posting the updated
              policy on our website. Continued use of our service after changes constitutes acceptance.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage
