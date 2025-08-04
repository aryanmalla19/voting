"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../config"
import { toast } from "react-toastify"
import {
  FaShieldAlt,
  FaLock,
  FaInfoCircle,
  FaExclamationCircle,
  FaCheckCircle,
  FaGraduationCap,
  FaBriefcase,
  FaTrophy,
  FaHandshake,
  FaGlobe,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaChevronDown,
  FaChevronUp,
  FaVoteYea,
} from "react-icons/fa"
import Spinner from "../components/layout/Spinner"

const VotePage = () => {
  const { id: electionId } = useParams()
  const navigate = useNavigate()

  const [election, setElection] = useState(null)
  const [selectedCandidateId, setSelectedCandidateId] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationCode, setVerificationCode] = useState(null)
  const [error, setError] = useState(null)
  const [expandedCandidate, setExpandedCandidate] = useState(null)

  useEffect(() => {
    const fetchElection = async () => {
      setIsLoading(true)
      try {
        const res = await axios.get(`${API_URL}/api/elections/${electionId}`)
        setElection(res.data.data)
      } catch (err) {
        setError(err.response?.data?.message || "Election not found or no longer available.")
        toast.error(err.response?.data?.message || "Failed to load election.")
      }
      setIsLoading(false)
    }
    fetchElection()
  }, [electionId])

  const handleVoteSubmit = async () => {
    if (!selectedCandidateId) {
      toast.error("Please select a candidate to vote for.")
      return
    }
    setIsSubmitting(true)
    try {
      const res = await axios.post(`${API_URL}/api/votes`, {
        electionId: election._id,
        candidateId: selectedCandidateId,
      })
      setVerificationCode(res.data.data.verificationCode)
      toast.success("Your vote has been securely recorded!")
    } catch (err) {
      toast.error(err.response?.data?.message || "Error submitting vote. You may have already voted.")
    }
    setIsSubmitting(false)
  }

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const getSocialIcon = (platform) => {
    const icons = {
      website: FaGlobe,
      twitter: FaTwitter,
      facebook: FaFacebook,
      linkedin: FaLinkedin,
    }
    return icons[platform] || FaGlobe
  }

  if (isLoading) return <Spinner />

  if (error || !election) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <FaExclamationCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Election Not Found</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <button onClick={() => navigate("/dashboard")} className="btn btn-primary">
          Return to Dashboard
        </button>
      </div>
    )
  }

  if (verificationCode) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg p-8 text-center">
          <FaCheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Vote Successfully Recorded!</h1>
          <p className="text-gray-600 mb-6">Your vote has been securely encrypted and stored.</p>
          <div className="bg-gray-100 p-4 rounded-md mb-6">
            <h3 className="font-semibold text-gray-700">Verification Code:</h3>
            <p className="text-lg font-mono text-primary break-all">{verificationCode}</p>
            <p className="text-xs text-gray-500 mt-1">
              Save this code to verify your vote was counted when results are published.
            </p>
          </div>
          <button onClick={() => navigate("/dashboard")} className="btn btn-primary w-full">
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Election Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{election.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{election.description}</p>
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center bg-green-50 px-4 py-2 rounded-full">
              <FaShieldAlt className="mr-2 text-green-500" /> Secure & Encrypted
            </span>
            <span className="flex items-center bg-blue-50 px-4 py-2 rounded-full">
              <FaLock className="mr-2 text-blue-500" /> Anonymous Ballot
            </span>
            <span className="flex items-center bg-purple-50 px-4 py-2 rounded-full">
              <FaVoteYea className="mr-2 text-purple-500" /> One Vote Per Person
            </span>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-6 mb-8 rounded-md" role="alert">
          <div className="flex">
            <FaInfoCircle className="h-6 w-6 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-lg">Important Voting Information</p>
              <p className="mt-1">You can only vote once. Your selection cannot be changed after submission.</p>
              <p className="mt-2 text-sm">
                <strong>Voting Period:</strong> {formatDate(election.startDate)} to {formatDate(election.endDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Candidates Section */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h2 className="text-2xl font-semibold text-white">Select Your Candidate</h2>
            <p className="text-blue-100 mt-1">Review each candidate's profile and make your choice</p>
          </div>

          <div className="p-8 space-y-6">
            {election.candidates.map((candidate) => (
              <div
                key={candidate._id}
                className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                  selectedCandidateId === candidate._id
                    ? "border-primary ring-2 ring-primary bg-primary/5 shadow-lg"
                    : "border-gray-300 hover:border-gray-400 hover:shadow-md"
                }`}
              >
                {/* Candidate Header */}
                <label htmlFor={candidate._id} className="flex items-start p-6 cursor-pointer">
                  <input
                    type="radio"
                    id={candidate._id}
                    name="candidate"
                    value={candidate._id}
                    checked={selectedCandidateId === candidate._id}
                    onChange={() => setSelectedCandidateId(candidate._id)}
                    className="h-5 w-5 text-primary border-gray-300 focus:ring-primary mt-2 mr-4 flex-shrink-0"
                  />

                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center mb-4">
                        {candidate.image ? (
                          <img
                            src={candidate.image || "/placeholder.svg"}
                            alt={candidate.name}
                            className="h-16 w-16 rounded-full mr-4 object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold mr-4">
                            {candidate.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                        )}
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800">{candidate.name}</h3>
                          <p className="text-lg text-primary font-semibold">{candidate.position}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-3xl mr-2">{candidate.symbol}</span>
                            <span className="text-sm text-gray-500">Symbol</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          setExpandedCandidate(expandedCandidate === candidate._id ? null : candidate._id)
                        }}
                        className="text-gray-500 hover:text-gray-700 p-2"
                      >
                        {expandedCandidate === candidate._id ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </div>

                    {/* Bio */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 mb-2">Biography</h4>
                      <p className="text-gray-600 leading-relaxed">{candidate.bio}</p>
                    </div>

                    {/* Agenda */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 mb-2">Campaign Agenda</h4>
                      <p className="text-gray-600 leading-relaxed">{candidate.agenda}</p>
                    </div>
                  </div>
                </label>

                {/* Expanded Details */}
                {expandedCandidate === candidate._id && candidate.campaignInfo && (
                  <div className="border-t bg-gray-50 p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Experience */}
                      {candidate.campaignInfo.experience && (
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                            <FaBriefcase className="mr-2 text-blue-500" />
                            Experience
                          </h4>
                          <p className="text-gray-600 leading-relaxed">{candidate.campaignInfo.experience}</p>
                        </div>
                      )}

                      {/* Education */}
                      {candidate.campaignInfo.education && (
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                            <FaGraduationCap className="mr-2 text-green-500" />
                            Education
                          </h4>
                          <p className="text-gray-600 leading-relaxed">{candidate.campaignInfo.education}</p>
                        </div>
                      )}
                    </div>

                    {/* Achievements */}
                    {candidate.campaignInfo.achievements && candidate.campaignInfo.achievements.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                          <FaTrophy className="mr-2 text-yellow-500" />
                          Key Achievements
                        </h4>
                        <ul className="space-y-2">
                          {candidate.campaignInfo.achievements.map((achievement, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-yellow-500 mr-2 mt-1">•</span>
                              <span className="text-gray-600">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Campaign Promises */}
                    {candidate.campaignInfo.promises && candidate.campaignInfo.promises.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                          <FaHandshake className="mr-2 text-purple-500" />
                          Campaign Promises
                        </h4>
                        <ul className="space-y-2">
                          {candidate.campaignInfo.promises.map((promise, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-purple-500 mr-2 mt-1">•</span>
                              <span className="text-gray-600">{promise}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Social Media */}
                    {candidate.campaignInfo.socialMedia && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-700 mb-3">
                          Connect with {candidate.name.split(" ")[0]}
                        </h4>
                        <div className="flex space-x-4">
                          {Object.entries(candidate.campaignInfo.socialMedia).map(([platform, url]) => {
                            if (!url) return null
                            const IconComponent = getSocialIcon(platform)
                            return (
                              <a
                                key={platform}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center px-3 py-2 bg-white rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
                              >
                                <IconComponent className="mr-2 text-gray-600" />
                                <span className="text-sm text-gray-700 capitalize">
                                  {platform === "website" ? "Website" : platform}
                                </span>
                              </a>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Submit Section */}
          <div className="bg-gray-50 px-8 py-6 flex justify-between items-center border-t">
            <button
              onClick={() => navigate("/dashboard")}
              className="btn text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleVoteSubmit}
              disabled={isSubmitting || !selectedCandidateId || election.status !== "active"}
              className="btn btn-primary disabled:opacity-50 flex items-center"
            >
              <FaVoteYea className="mr-2" />
              {isSubmitting ? "Submitting Vote..." : election.status !== "active" ? "Voting Closed" : "Submit My Vote"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VotePage
