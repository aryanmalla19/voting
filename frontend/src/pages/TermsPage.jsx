"use client"

import { FaGavel, FaVoteYea, FaUserCheck, FaExclamationTriangle } from "react-icons/fa"

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <FaGavel className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Agreement to Terms</h2>
          <p className="text-gray-600 mb-4">
            By accessing and using SecureVote ("the Service"), you agree to be bound by these Terms of Service
            ("Terms"). If you do not agree to these Terms, you may not use the Service.
          </p>
        </div>

        {/* Voting Rules */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <FaVoteYea className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Voting Rules and Eligibility</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Voter Eligibility</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Must be 18 years of age or older</li>
                <li>Must provide valid government-issued identification</li>
                <li>Must have a verified email address</li>
                <li>Must complete the full registration process</li>
                <li>Must not be disqualified by law from voting</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Voting Process</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Each eligible voter may cast one vote per election</li>
                <li>Votes cannot be changed once submitted</li>
                <li>Voting is anonymous and confidential</li>
                <li>Vote buying, selling, or coercion is strictly prohibited</li>
                <li>Voters must cast their own votes personally</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Election Integrity</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Any attempt to manipulate or interfere with elections is prohibited</li>
                <li>Multiple account creation is forbidden</li>
                <li>Sharing login credentials is not allowed</li>
                <li>Technical attacks on the system are illegal and will be prosecuted</li>
              </ul>
            </div>
          </div>
        </div>

        {/* User Responsibilities */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <FaUserCheck className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">User Responsibilities</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Security</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Keep your login credentials secure and confidential</li>
                <li>Use a strong, unique password</li>
                <li>Do not share your account with others</li>
                <li>Report any unauthorized access immediately</li>
                <li>Verify your email address promptly</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Accurate Information</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Provide truthful and accurate registration information</li>
                <li>Update your information if it changes</li>
                <li>Use only valid government-issued identification</li>
                <li>Ensure your contact information is current</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Prohibited Activities</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Creating multiple accounts</li>
                <li>Impersonating another person</li>
                <li>Attempting to hack or compromise the system</li>
                <li>Interfering with other users' voting rights</li>
                <li>Spreading false information about elections</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Candidate Terms */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Candidate Terms</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Candidate Eligibility</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Must be a registered user of the platform</li>
                <li>Must meet all legal requirements for the position</li>
                <li>Must provide complete and accurate candidate information</li>
                <li>Must have a verified account in good standing</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Campaign Conduct</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Campaign information must be truthful and accurate</li>
                <li>No false or misleading statements about opponents</li>
                <li>Respect intellectual property rights</li>
                <li>Comply with all applicable election laws</li>
                <li>No harassment or intimidation of voters or other candidates</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Privacy and Data */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy and Data Protection</h2>
          <p className="text-gray-600 mb-4">
            Your privacy is important to us. Our collection and use of personal information is governed by our Privacy
            Policy, which is incorporated into these Terms by reference.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>We collect only necessary information for voting eligibility</li>
            <li>Your vote choices are anonymous and cannot be linked to your identity</li>
            <li>Personal information is protected with industry-standard security</li>
            <li>We do not sell or share your personal information with third parties</li>
          </ul>
        </div>

        {/* Disclaimers */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <FaExclamationTriangle className="h-8 w-8 text-yellow-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Disclaimers and Limitations</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Service Availability</h3>
              <p className="text-gray-600">
                While we strive for 100% uptime, we cannot guarantee uninterrupted service. We may perform maintenance
                or updates that temporarily affect availability.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Issues</h3>
              <p className="text-gray-600">
                In case of technical issues during voting, we will make every effort to resolve problems quickly and
                ensure all eligible votes are counted.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Limitation of Liability</h3>
              <p className="text-gray-600">
                SecureVote's liability is limited to the maximum extent permitted by law. We are not liable for any
                indirect, incidental, or consequential damages.
              </p>
            </div>
          </div>
        </div>

        {/* Enforcement */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Enforcement and Violations</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Violations</h3>
              <p className="text-gray-600 mb-2">Violations of these Terms may result in:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Warning or account suspension</li>
                <li>Permanent account termination</li>
                <li>Disqualification from current or future elections</li>
                <li>Legal action if laws are broken</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reporting Violations</h3>
              <p className="text-gray-600">
                If you become aware of any violations of these Terms, please report them immediately to our support team
                at{" "}
                <a href="mailto:support@securevote.com" className="text-primary hover:text-primary-hover">
                  support@securevote.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Changes to Terms */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Changes to Terms</h2>
          <p className="text-gray-600 mb-4">We may update these Terms from time to time. When we do, we will:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Post the updated Terms on this page</li>
            <li>Update the "Last updated" date</li>
            <li>Notify users of significant changes via email</li>
            <li>Require acceptance of new Terms for continued use</li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="bg-primary text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Questions About These Terms?</h2>
          <p className="text-lg mb-6">If you have any questions about these Terms of Service, please contact us.</p>
          <div className="space-y-2">
            <p>
              Email:{" "}
              <a href="mailto:legal@securevote.com" className="underline">
                legal@securevote.com
              </a>
            </p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Address: 123 Democracy Street, Vote City, VC 12345</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsPage
