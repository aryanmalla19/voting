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
  FaBriefcase as FaPosition,
} from "react-icons/fa"
import Spinner from "../components/layout/Spinner"

const VotePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token, user } = useContext(AuthContext)

  const [election, setElection] = useState(null)
  const [selectedCandidates, setSelectedCandidates] = useState({}) // positionId -> candidateId
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [expandedCandidate, setExpandedCandidate] = useState(null)
  const [votingStatus, setVotingStatus] = useState(null)

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
      const response = await fetch(`${API_URL}/api/votes/status/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setVotingStatus(data.data)
      }
    } catch (error) {
      console.error("Error checking voting status:", error)
    }
  }

  const handleCandidateSelect = (positionId, candidateId) => {
    setSelectedCandidates((prev) => ({
      ...prev,
      [positionId]: candidateId,
    }))
  }

  const handleVote = async () => {
    if (!votingStatus) return

    // Check if user has selected candidates for remaining positions
    const remainingPositionIds = votingStatus.remainingPositions.map((p) => p.positionId)
    const selectedForRemaining = remainingPositionIds.filter((positionId) => selectedCandidates[positionId])

    if (selectedForRemaining.length === 0) {
      toast.error("Please select at least one candidate to vote for")
      return
    }

    setSubmitting(true)
    try {
      const votes = selectedForRemaining.map((positionId) => ({
        positionId,
        candidateId: selectedCandidates[positionId],
      }))

      const response = await fetch(`${API_URL}/api/votes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          electionId: id,
          votes,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(data.data.message)
        navigate("/dashboard")
      } else {
        const data = await response.json()
        toast.error(data.message || "Failed to submit votes")
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

  if (votingStatus?.hasVotedAll) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-xl p-8 text-center">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <FaCheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">All Votes Submitted</h1>
            <p className="text-gray-600 mb-8">
              You have successfully voted for all positions in this election. Thank you for participating in the
              democratic process.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Your Voting Summary</h3>
              <p className="text-blue-800 text-sm">
                Voted for {votingStatus.totalPositions} position(s) out of {votingStatus.totalPositions}
              </p>
            </div>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Voting Progress */}
        {votingStatus && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaInfoCircle className="mr-2 text-blue-600" />
                Voting Progress
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {votingStatus.totalPositions - votingStatus.remainingPositions.length}
                  </div>
                  <div className="text-sm text-gray-600">Positions Voted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{votingStatus.remainingPositions.length}</div>
                  <div className="text-sm text-gray-600">Remaining</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{votingStatus.totalPositions}</div>
                  <div className="text-sm text-gray-600">Total Positions</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Voting Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <FaInfoCircle className="h-6 w-6 text-blue-600 mt-1 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Multi-Position Voting Instructions</h3>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• This election has multiple positions you can vote for</li>
                <li>• You can vote for one candidate per position</li>
                <li>• You don't have to vote for all positions, but you can only vote once per position</li>
                <li>• Your votes are encrypted and anonymous</li>
                <li>• Click "Submit Votes" to finalize your selections</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Positions and Candidates */}
        <div className="space-y-8">
          {election.positions.map((position) => {
            const hasVotedForPosition = votingStatus?.votedPositions.includes(position.positionId)
            const canVoteForPosition = votingStatus?.remainingPositions.some(
              (p) => p.positionId === position.positionId,
            )

            return (
              <div key={position.positionId} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center">
                        <FaPosition className="mr-3" />
                        {position.title}
                      </h2>
                      <p className="text-purple-100 mt-2">{position.description}</p>
                    </div>
                    <div className="text-right">
                      {hasVotedForPosition ? (
                        <div className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center">
                          <FaCheckCircle className="mr-2" />
                          <span className="text-sm font-medium">Voted</span>
                        </div>
                      ) : canVoteForPosition ? (
                        <div className="bg-yellow-500 text-white px-4 py-2 rounded-full">
                          <span className="text-sm font-medium">Available</span>
                        </div>
                      ) : (
                        <div className="bg-gray-500 text-white px-4 py-2 rounded-full">
                          <span className="text-sm font-medium">Completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {canVoteForPosition && (
                  <div className="p-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {position.candidates.map((candidate) => (
                        <div
                          key={candidate.candidateId}
                          className={`bg-gray-50 rounded-xl shadow-sm overflow-hidden cursor-pointer transition-all duration-200 ${
                            selectedCandidates[position.positionId] === candidate.candidateId
                              ? "ring-4 ring-blue-500 shadow-xl transform scale-105"
                              : "hover:shadow-lg hover:transform hover:scale-102"
                          }`}
                          onClick={() => handleCandidateSelect(position.positionId, candidate.candidateId)}
                        >
                          {/* Candidate Photo */}
                          <div className="relative h-48 bg-gray-200">
                            {candidate.photo ? (
                              <img
                                src={`${API_URL}/${candidate.photo || "placeholder.svg"}`}
                                alt={candidate.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FaUser className="h-16 w-16 text-gray-400" />
                              </div>
                            )}
                            {selectedCandidates[position.positionId] === candidate.candidateId && (
                              <div className="absolute top-4 right-4">
                                <div className="bg-blue-500 text-white rounded-full p-2">
                                  <FaCheckCircle className="h-5 w-5" />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Candidate Info */}
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
                                <div className="flex items-center text-sm text-gray-600 mt-1">
                                  <span className="text-2xl mr-2">{candidate.symbol}</span>
                                  <span>Election Symbol</span>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setExpandedCandidate(
                                    expandedCandidate === `${position.positionId}-${candidate.candidateId}`
                                      ? null
                                      : `${position.positionId}-${candidate.candidateId}`,
                                  )
                                }}
                                className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                {expandedCandidate === `${position.positionId}-${candidate.candidateId}` ? (
                                  <>
                                    <span className="mr-1">Less Details</span>
                                    <FaChevronUp />
                                  </>
                                ) : (
                                  <>
                                    <span className="mr-1">More Details</span>
                                    <FaChevronDown />
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Always Visible: Bio and Agenda */}
                            <div className="space-y-3">
                              {candidate.bio && (
                                <div>
                                  <h4 className="font-medium text-gray-900 flex items-center mb-2">
                                    <FaUser className="mr-2 text-blue-600" />
                                    Biography
                                  </h4>
                                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">{candidate.bio}</p>
                                </div>
                              )}

                              {candidate.agenda && (
                                <div>
                                  <h4 className="font-medium text-gray-900 flex items-center mb-2">
                                    <FaHandshake className="mr-2 text-green-600" />
                                    Campaign Agenda
                                  </h4>
                                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
                                    {candidate.agenda}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Expandable Details */}
                            {expandedCandidate === `${position.positionId}-${candidate.candidateId}` && (
                              <div
                                className="mt-6 pt-6 border-t border-gray-200 space-y-4"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {/* Experience */}
                                {candidate.campaignInfo?.experience && (
                                  <div>
                                    <h5 className="flex items-center font-medium text-gray-800 mb-2">
                                      <FaBriefcase className="mr-2 text-green-500" />
                                      Experience
                                    </h5>
                                    <p className="text-gray-600 text-sm">{candidate.campaignInfo.experience}</p>
                                  </div>
                                )}

                                {/* Education */}
                                {candidate.campaignInfo?.education && (
                                  <div>
                                    <h5 className="flex items-center font-medium text-gray-800 mb-2">
                                      <FaGraduationCap className="mr-2 text-purple-500" />
                                      Education
                                    </h5>
                                    <p className="text-gray-600 text-sm">{candidate.campaignInfo.education}</p>
                                  </div>
                                )}

                                {/* Achievements */}
                                {candidate.campaignInfo?.achievements &&
                                  candidate.campaignInfo.achievements.length > 0 && (
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
                                {candidate.campaignInfo?.promises && candidate.campaignInfo.promises.length > 0 && (
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
                                {candidate.campaignInfo?.socialMedia && (
                                  <div>
                                    <h5 className="font-medium text-gray-800 mb-2">Connect with {candidate.name}</h5>
                                    <div className="flex space-x-3">
                                      {renderSocialMedia(candidate.campaignInfo.socialMedia)}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {hasVotedForPosition && (
                  <div className="p-6 bg-green-50 border-t border-green-200">
                    <div className="flex items-center justify-center text-green-800">
                      <FaCheckCircle className="mr-2" />
                      <span className="font-medium">You have already voted for this position</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Vote Submission */}
        {votingStatus && votingStatus.remainingPositions.length > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Submit Your Votes?</h2>
              <div className="mb-6">
                {Object.keys(selectedCandidates).length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-gray-600 mb-4">You have selected candidates for the following positions:</p>
                    {Object.entries(selectedCandidates).map(([positionId, candidateId]) => {
                      const position = election.positions.find((p) => p.positionId === positionId)
                      const candidate = position?.candidates.find((c) => c.candidateId === candidateId)
                      return (
                        <div key={positionId} className="inline-flex items-center bg-blue-50 rounded-lg px-4 py-2 mx-2">
                          <span className="text-sm">
                            <strong>{position?.title}:</strong> {candidate?.name}
                          </span>
                          <span className="ml-2 text-lg">{candidate?.symbol}</span>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-gray-600 mb-6">Please select candidates for the positions you want to vote for.</p>
                )}
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVote}
                  disabled={Object.keys(selectedCandidates).length === 0 || submitting}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  <FaVoteYea className="mr-2" />
                  {submitting ? "Submitting..." : `Submit ${Object.keys(selectedCandidates).length} Vote(s)`}
                </button>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                <div className="flex items-center justify-center">
                  <FaShieldAlt className="mr-2" />
                  <span>Your votes are encrypted and anonymous</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VotePage
