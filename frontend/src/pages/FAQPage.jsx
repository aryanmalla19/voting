import { useState } from "react"
import { FaQuestionCircle, FaChevronDown, FaChevronUp } from "react-icons/fa"

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left"
      >
        <span className="text-lg font-medium text-gray-800">{question}</span>
        {isOpen ? (
          <FaChevronUp className="text-primary" />
        ) : (
          <FaChevronDown className="text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="mt-3 text-gray-600 leading-relaxed">
          <p>{answer}</p>
        </div>
      )}
    </div>
  )
}

const FAQPage = () => {
  const faqs = [
    {
      question: "Is online voting secure with SecureVote?",
      answer:
        "Yes, security is our top priority. We use end-to-end encryption for all votes, secure multi-factor authentication for voters, and robust infrastructure to protect against tampering and unauthorized access. Your vote remains anonymous and confidential.",
    },
    {
      question: "How do I register to vote?",
      answer:
        "You can register by clicking the 'Register' button on our homepage or navigation bar. You'll need to provide some basic information and may need to verify your identity depending on the election requirements.",
    },
    {
      question: "Can I change my vote after submitting it?",
      answer:
        "No, once a vote is submitted, it cannot be changed. This is to ensure the integrity and finality of the voting process, similar to traditional paper ballot systems.",
    },
    {
      question: "How can I be sure my vote was counted?",
      answer:
        "After voting, you will receive a unique, anonymous verification code. Once the election results are published, you can use this code to confirm that your vote was included in the final tally without revealing how you voted.",
    },
    {
      question: "Who can use SecureVote?",
      answer:
        "SecureVote is designed for a wide range of organizations, including schools and universities, corporations for shareholder voting, non-profit organizations, clubs, and even for smaller-scale local government referendums or elections.",
    },
    {
      question: "What technology does SecureVote use?",
      answer:
        "Our platform is built using modern web technologies with a strong focus on security. This includes React for the frontend, Node.js and Express for the backend, MongoDB for the database, and advanced cryptographic techniques for vote encryption and security.",
    },
  ]

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <FaQuestionCircle className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Frequently Asked Questions</h1>
          <p className="mt-4 text-xl text-gray-600">
            Find answers to common questions about SecureVote.
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg p-8">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default FAQPage
