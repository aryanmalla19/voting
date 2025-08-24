"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { API_URL } from "../config"
import { toast } from "react-toastify"
import {
  FaVoteYea,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaShieldAlt,
  FaCheckCircle,
  FaInfoCircle,
  FaGlobe,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaGraduationCap,
  FaBriefcase,
  FaTrophy,
  FaHandshake,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa"
import Spinner from "../components/layout/Spinner"

const VotePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token, user } = useContext(AuthContext)

  const [election, setElection] = useState(null)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [expandedCandidate, setExpandedCandidate] = useState(null)
  const [hasVoted, setHasVoted] = useState(false)

  useEffect(() => {
    fetchElection()
    checkVotingStatus()
  }, [id])

  const fetchElection = async () => {
    try {
      const response = await fetch(`${API_URL}/api/elections/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setElection(data.data)
      } else {
        toast.error("Failed to fetch election details")
        navigate("/dashboard")
      }
    } catch (error) {
      toast.error("Network error occurred")
      navigate("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  const checkVotingStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/votes/check/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setHasVoted(data.hasVoted)
      }
    } catch (error) {
      console.error("Error checking voting status:", error)
    }
  }

  const handleVote = async () => {
    if (!selectedCandidate) {
      toast.error("Please select a candidate")
      return
    }

    setSubmitting(true)
    try {
      console.log("Submitting vote for candidate:", selectedCandidate);
      console.log(election._id);
      console.log(id);
      const response = await fetch(`${API_URL}/api/votes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          electionId: id,
          candidateId: selectedCandidate,
        }),
      })

      if (response.ok) {
        toast.success("Vote submitted successfully!")
        navigate("/dashboard")
      } else {
        const data = await response.json()
        toast.error(data.message || "Failed to submit vote")
      }
    } catch (error) {
      toast.error("Network error occurred")
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getElectionStatus = () => {
    if (!election) return null

    const now = new Date()
    const startDate = new Date(election.startDate)
    const endDate = new Date(election.endDate)

    if (now < startDate) {
      return { status: "upcoming", color: "bg-yellow-100 text-yellow-800", text: "Upcoming" }
    } else if (now >= startDate && now <= endDate) {
      return { status: "active", color: "bg-green-100 text-green-800", text: "Active" }
    } else {
      return { status: "completed", color: "bg-gray-100 text-gray-800", text: "Completed" }
    }
  }

  const renderSocialMedia = (socialMedia) => {
    const platforms = [
      { key: "website", icon: FaGlobe, color: "text-blue-600", label: "Website" },
      { key: "twitter", icon: FaTwitter, color: "text-blue-400", label: "Twitter" },
      { key: "facebook", icon: FaFacebook, color: "text-blue-600", label: "Facebook" },
      { key: "linkedin", icon: FaLinkedin, color: "text-blue-700", label: "LinkedIn" },
    ]

    return platforms
      .filter((platform) => socialMedia[platform.key])
      .map((platform) => {
        const IconComponent = platform.icon
        return (
          <a
            key={platform.key}
            href={socialMedia[platform.key]}
            target="_blank"
            rel="noopener noreferrer"
            className={`${platform.color} hover:opacity-75 transition-opacity`}
            title={platform.label}
          >
            <IconComponent className="h-5 w-5" />
          </a>
        )
      })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!election) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Election Not Found</h2>
          <button onClick={() => navigate("/dashboard")} className="btn btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const statusInfo = getElectionStatus()

  if (hasVoted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-xl p-8 text-center">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <FaCheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Vote Already Submitted</h1>
            <p className="text-gray-600 mb-8">
              You have already voted in this election. Thank you for participating in the democratic process.
            </p>
            <div className="space-x-4">
              <button onClick={() => navigate("/dashboard")} className="btn btn-primary">
                Back to Dashboard
              </button>
              <button onClick={() => navigate(`/results/${id}`)} className="btn btn-neutral">
                View Results
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (statusInfo.status !== "active") {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-xl p-8 text-center">
            <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <FaClock className="h-8 w-8 text-gray-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Voting Not Available</h1>
            <p className="text-gray-600 mb-8">
              This election is currently {statusInfo.text.toLowerCase()}. Voting is only available during the active
              period.
            </p>
            <button onClick={() => navigate("/dashboard")} className="btn btn-primary">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{election.title}</h1>
              <p className="text-blue-100 mt-2">{election.description}</p>
              <div className="flex items-center space-x-4 mt-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                  {statusInfo.text}
                </span>
                <div className="flex items-center text-blue-100">
                  <FaCalendarAlt className="mr-2" />
                  <span className="text-sm">
                    {formatDate(election.startDate)} - {formatDate(election.endDate)}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-blue-100 mb-2">
                <FaShieldAlt className="mr-2" />
                <span className="text-sm">Secure Voting</span>
              </div>
              <div className="flex items-center text-blue-100">
                <FaUser className="mr-2" />
                <span className="text-sm">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Voting Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <FaInfoCircle className="h-6 w-6 text-blue-600 mt-1 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Voting Instructions</h3>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• Review all candidate information carefully before making your selection</li>
                <li>• Click on a candidate card to select them for your vote</li>
                <li>• You can only vote once in this election</li>
                <li>• Your vote is encrypted and anonymous</li>
                <li>• Click "Submit Vote" to finalize your choice</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Candidates Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {election.candidates.map((candidate) => (
            <div
              key={candidate._id}
              className={`bg-white h-fit rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                selectedCandidate === candidate._id
                  ? "ring-4 ring-blue-500 shadow-xl transform scale-105"
                  : "hover:shadow-xl hover:transform hover:scale-102"
              }`}
              onClick={() => setSelectedCandidate(candidate._id)}
            >
            
              {/* Candidate Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  {selectedCandidate === candidate._id && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-blue-500 text-white rounded-full p-2">
                      <FaCheckCircle className="h-5 w-5" />
                    </div>
                  </div>
                )}
                  <div>
                    <div className="flex items-center mb-2">
                  {candidate.photo ? (
                    <img
                      src={ API_URL + '/' + candidate.photo || "/placeholder.svg"}
                      alt={candidate.name}
                      className="w-16 border shadow-sm h-16 object-cover rounded-full mr-3"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaUser className="w-10 h-10 object-cover rounded-full mr-3 text-gray-400" />
                    </div>
                  )}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
                      <p className="text-blue-600 font-medium">{candidate.position}</p>
                    </div>
                    </div>
                  </div>
                  <div className="text-2xl">{candidate.symbol}</div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Bio</h4>
                  <p className="text-gray-600 text-sm line-clamp-3">{candidate.bio}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Agenda</h4>
                  <p className="text-gray-600 text-sm line-clamp-4">{candidate.agenda}</p>
                </div>

                {/* Expandable Campaign Info */}
                {candidate.campaignInfo && (
                  <div className="border-t pt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandedCandidate(expandedCandidate === candidate._id ? null : candidate._id)
                      }}
                      className="flex items-center justify-between w-full text-left text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <span>View Campaign Details</span>
                      {expandedCandidate === candidate._id ? <FaChevronUp /> : <FaChevronDown />}
                    </button>

                    {expandedCandidate === candidate._id && (
                      <div className="mt-4 space-y-4" onClick={(e) => e.stopPropagation()}>
                        {/* Experience */}
                        {candidate.campaignInfo.experience && (
                          <div>
                            <h5 className="flex items-center font-medium text-gray-800 mb-2">
                              <FaBriefcase className="mr-2 text-blue-500" />
                              Experience
                            </h5>
                            <p className="text-gray-600 text-sm">{candidate.campaignInfo.experience}</p>
                          </div>
                        )}

                        {/* Education */}
                        {candidate.campaignInfo.education && (
                          <div>
                            <h5 className="flex items-center font-medium text-gray-800 mb-2">
                              <FaGraduationCap className="mr-2 text-green-500" />
                              Education
                            </h5>
                            <p className="text-gray-600 text-sm">{candidate.campaignInfo.education}</p>
                          </div>
                        )}

                        {/* Achievements */}
                        {candidate.campaignInfo.achievements && candidate.campaignInfo.achievements.length > 0 && (
                          <div>
                            <h5 className="flex items-center font-medium text-gray-800 mb-2">
                              <FaTrophy className="mr-2 text-yellow-500" />
                              Achievements
                            </h5>
                            <ul className="text-gray-600 text-sm space-y-1">
                              {candidate.campaignInfo.achievements.map((achievement, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="mr-2">•</span>
                                  <span>{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Promises */}
                        {candidate.campaignInfo.promises && candidate.campaignInfo.promises.length > 0 && (
                          <div>
                            <h5 className="flex items-center font-medium text-gray-800 mb-2">
                              <FaHandshake className="mr-2 text-purple-500" />
                              Campaign Promises
                            </h5>
                            <ul className="text-gray-600 text-sm space-y-1">
                              {candidate.campaignInfo.promises.map((promise, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="mr-2">•</span>
                                  <span>{promise}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Social Media */}
                        {candidate.campaignInfo.socialMedia && (
                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">Connect</h5>
                            <div className="flex space-x-3">
                              {renderSocialMedia(candidate.campaignInfo.socialMedia)}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Vote Submission */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Vote?</h2>
            {selectedCandidate ? (
              <div className="mb-6">
                <p className="text-gray-600 mb-2">You have selected:</p>
                <div className="inline-flex items-center bg-blue-50 rounded-lg px-4 py-2">
                  <span className="text-lg font-semibold text-blue-900">
                    {election.candidates.find((c) => c._id === selectedCandidate)?.name}
                  </span>
                  <span className="ml-2 text-2xl">
                    {election.candidates.find((c) => c._id === selectedCandidate)?.symbol}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 mb-6">Please select a candidate above to proceed with voting.</p>
            )}

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleVote}
                disabled={!selectedCandidate || submitting}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <FaVoteYea className="mr-2" />
                {submitting ? "Submitting..." : "Submit Vote"}
              </button>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <div className="flex items-center justify-center">
                <FaShieldAlt className="mr-2" />
                <span>Your vote is encrypted and anonymous</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VotePage
