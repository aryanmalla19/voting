"use client"

import { FaShieldAlt, FaLock, FaUserShield, FaEye, FaServer, FaKey } from "react-icons/fa"

const SecurityPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Security & Trust</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your vote security is our top priority. Learn about the comprehensive measures we take to protect your
            privacy and ensure election integrity.
          </p>
        </div>

        {/* Security Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <FaLock className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">End-to-End Encryption</h3>
            <p className="text-gray-600">
              All votes are encrypted using AES-256 encryption before transmission and storage, ensuring complete
              privacy.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <FaUserShield className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Factor Authentication</h3>
            <p className="text-gray-600">
              Email verification and government ID validation ensure only eligible voters can participate.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <FaEye className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Anonymous Voting</h3>
            <p className="text-gray-600">
              Your vote is completely anonymous. We cannot link your identity to your vote choice.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <FaServer className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Infrastructure</h3>
            <p className="text-gray-600">
              Our servers use enterprise-grade security with regular penetration testing and monitoring.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <FaKey className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Signatures</h3>
            <p className="text-gray-600">
              Each vote is digitally signed to prevent tampering while maintaining voter anonymity.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <FaShieldAlt className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Audit Trail</h3>
            <p className="text-gray-600">
              Complete audit logs for transparency while protecting individual voter privacy.
            </p>
          </div>
        </div>

        {/* Detailed Security Information */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Protect Your Vote</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Identity Verification</h3>
              <p className="text-gray-600 mb-2">Before you can vote, we verify your identity through:</p>
              <ul className="list-disc list-inside text-gray-600 ml-4">
                <li>Government-issued ID verification (Passport or Driver's License)</li>
                <li>Email address verification</li>
                <li>Address confirmation</li>
                <li>Age verification (18+ requirement)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Vote Encryption Process</h3>
              <p className="text-gray-600 mb-2">Your vote goes through multiple layers of security:</p>
              <ul className="list-disc list-inside text-gray-600 ml-4">
                <li>Vote is encrypted on your device before transmission</li>
                <li>Encrypted vote is transmitted over HTTPS</li>
                <li>Vote is stored encrypted in our secure database</li>
                <li>Decryption only occurs during official counting</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Anonymity Protection</h3>
              <p className="text-gray-600 mb-2">We ensure your vote remains anonymous through:</p>
              <ul className="list-disc list-inside text-gray-600 ml-4">
                <li>Separation of voter identity and vote choice</li>
                <li>Anonymous vote tokens</li>
                <li>Batch processing to prevent timing analysis</li>
                <li>Zero-knowledge proof systems</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">4. System Security</h3>
              <p className="text-gray-600 mb-2">Our infrastructure is protected by:</p>
              <ul className="list-disc list-inside text-gray-600 ml-4">
                <li>Regular security audits and penetration testing</li>
                <li>24/7 monitoring and intrusion detection</li>
                <li>Distributed denial-of-service (DDoS) protection</li>
                <li>Secure backup and disaster recovery systems</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Compliance Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Compliance & Standards</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Security Standards</h3>
              <ul className="list-disc list-inside text-gray-600">
                <li>ISO 27001 Information Security Management</li>
                <li>SOC 2 Type II Compliance</li>
                <li>GDPR Data Protection Compliance</li>
                <li>Election Security Best Practices</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Regular Audits</h3>
              <ul className="list-disc list-inside text-gray-600">
                <li>Third-party security assessments</li>
                <li>Code reviews by security experts</li>
                <li>Vulnerability scanning and testing</li>
                <li>Compliance audits and certifications</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-primary text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Questions About Security?</h2>
          <p className="text-lg mb-6">
            Our security team is available to address any concerns you may have about the voting process.
          </p>
          <div className="space-x-4">
            <a
              href="mailto:query.securevote@gmail.com"
              className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            >
              Contact Security Team
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecurityPage
