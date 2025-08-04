// Content from previous HomePage.js, converted to JSX and types removed
// (Assuming it was already mostly JS with JSX)
import { Link } from "react-router-dom"
import { FaLock, FaShieldAlt, FaChartBar, FaUserCheck, FaUniversity, FaBuilding, FaUsers } from "react-icons/fa"

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-secondary text-indigo-950">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-neutral-dark">{title}</h3>
    <p className="text-neutral text-sm">{description}</p>
  </div>
)

const StepCard = ({ number, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-indigo-950 text-xl font-bold mb-4">
      {number}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-neutral-dark">{title}</h3>
    <p className="text-neutral text-sm">{description}</p>
  </div>
)

const UseCaseCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
    <div className="text-indigo-950 text-3xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-neutral-dark">{title}</h3>
    <p className="text-neutral text-sm">{description}</p>
  </div>
)

const HomePage = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-6 py-20 md:py-32 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">Secure Online Voting System</h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            A modern, secure, and transparent platform for conducting elections with integrity and confidentiality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn btn-lg bg-white text-indigo-950 hover:bg-gray-100 px-8 py-3 text-lg">
              Register to Vote
            </Link>
            <Link to="/login" className="btn btn-lg border-indigo bg-indigo-900 text-white hover:bg-indigo-950 px-8 py-3 text-lg">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <h2 className="section-title">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<FaLock size={24} />}
              title="Secure Authentication"
              description="Multi-factor authentication ensures only eligible voters can access the system."
            />
            <FeatureCard
              icon={<FaShieldAlt size={24} />}
              title="End-to-End Encryption"
              description="All votes are encrypted to maintain confidentiality and prevent tampering."
            />
            <FeatureCard
              icon={<FaChartBar size={24} />}
              title="Real-Time Results"
              description="View election results in real-time with interactive data visualizations."
            />
            <FeatureCard
              icon={<FaUserCheck size={24} />}
              title="User-Friendly Interface"
              description="Intuitive design makes voting accessible to all users, including those with disabilities."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 lg:py-24 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="section-title">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard number="1" title="Register & Verify" description="Create an account and verify your identity." />
            <StepCard number="2" title="Cast Your Vote" description="Browse elections and securely cast your vote." />
            <StepCard number="3" title="Track Results" description="View real-time results and verify your vote." />
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <h2 className="section-title">Real-Life Use Cases</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <UseCaseCard
              icon={<FaUniversity />}
              title="Student Elections"
              description="For schools and universities to conduct student body elections securely."
            />
            <UseCaseCard
              icon={<FaBuilding />}
              title="Corporate Voting"
              description="For companies to manage shareholder or board elections with transparency."
            />
            <UseCaseCard
              icon={<FaUsers />}
              title="Community Groups"
              description="For local clubs and organizations to hold elections without physical presence."
            />
            <UseCaseCard
              icon={<FaShieldAlt />}
              title="Small-Scale Governance"
              description="For local referendums or small government elections with enhanced security."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            Join our secure voting platform today and experience the future of digital democracy.
          </p>
          <Link to="/register" className="btn btn-lg bg-white text-indigo-950 hover:bg-gray-100 px-10 py-4 text-lg">
            Register Now
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
