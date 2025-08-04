import { FaShieldAlt, FaUsers, FaBalanceScale } from "react-icons/fa"

const AboutPage = () => {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">About SecureVote</h1>
          <p className="mt-4 text-xl text-gray-600">
            Revolutionizing elections with security, transparency, and accessibility.
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              At SecureVote, our mission is to provide a robust, trustworthy, and user-friendly online voting platform
              that empowers organizations and communities to conduct elections with the highest level of integrity. We
              believe in the power of technology to make democratic processes more accessible, efficient, and secure for
              everyone.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">What We Do</h2>
            <p className="text-gray-700 leading-relaxed">
              We specialize in developing cutting-edge online voting solutions tailored to the needs of various
              organizations, including educational institutions, corporations, non-profits, and community groups. Our
              platform leverages advanced security protocols, including end-to-end encryption and secure voter
              authentication, to ensure every vote is confidential and every election is fair.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4">
                <FaShieldAlt className="h-10 w-10 text-primary mb-2" />
                <h3 className="text-lg font-medium text-gray-900">Security</h3>
                <p className="text-sm text-gray-600">
                  Protecting the integrity of every vote is our top priority.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <FaBalanceScale className="h-10 w-10 text-primary mb-2" />
                <h3 className="text-lg font-medium text-gray-900">Transparency</h3>
                <p className="text-sm text-gray-600">
                  Ensuring clear and verifiable election processes.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <FaUsers className="h-10 w-10 text-primary mb-2" />
                <h3 className="text-lg font-medium text-gray-900">Accessibility</h3>
                <p className="text-sm text-gray-600">
                  Making voting easy and available to all eligible participants.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">The SecureVote Team</h2>
            <p className="text-gray-700 leading-relaxed">
              Our team is composed of passionate developers, security experts, and election specialists dedicated to
              building the future of digital democracy. We are committed to continuous improvement and innovation to
              meet the evolving needs of our users.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              This platform is developed for AUSDAIS PTY LTD, bringing their vision for secure digital solutions to life.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
