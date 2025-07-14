"use client"

// Content from previous VotePage.js, converted to JSX and types removed
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../config"
import { toast } from "react-toastify"
import { FaShieldAlt, FaLock, FaInfoCircle, FaExclamationCircle, FaCheckCircle, FaUser } from "react-icons/fa"
import Spinner from "../components/layout/Spinner"

const VotePage = () => {
  const { id: electionId } = useParams()
  // const { user } = useContext(AuthContext); // user context might be needed for eligibility checks later
  const navigate = useNavigate()

  const [election, setElection] = useState(null)
  const [selectedCandidateId, setSelectedCandidateId] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationCode, setVerificationCode] = useState(null)
  const [error, setError] = useState(null)

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
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{election.title}</h1>
          <p className="text-gray-600">{election.description}</p>
          <div className="flex justify-center gap-4 mt-4 text-sm text-gray-500">
            <span className="flex items-center">
              <FaShieldAlt className="mr-1 text-green-500" /> Secure & Encrypted
            </span>
            <span className="flex items-center">
              <FaLock className="mr-1 text-primary" /> Anonymous Ballot
            </span>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-8 rounded-md" role="alert">
          <div className="flex">
            <FaInfoCircle className="h-5 w-5 mr-3 mt-0.5" />
            <div>
              <p className="font-bold">Important Information</p>
              <p>You can only vote once. Your selection cannot be changed after submission.</p>
              <p className="mt-1 text-xs">
                Voting Period: {formatDate(election.startDate)} to {formatDate(election.endDate)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Select Your Candidate</h2>
          <div className="space-y-6">
            {election.candidates.map((candidate) => (
              <label
                key={candidate._id}
                htmlFor={candidate._id}
                className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all
                                ${selectedCandidateId === candidate._id ? "border-primary ring-2 ring-primary bg-primary/5" : "border-gray-300 hover:border-gray-400"}`}
              >
                <input
                  type="radio"
                  id={candidate._id}
                  name="candidate"
                  value={candidate._id}
                  checked={selectedCandidateId === candidate._id}
                  onChange={() => setSelectedCandidateId(candidate._id)}
                  className="h-5 w-5 text-primary border-gray-300 focus:ring-primary mt-1 mr-4"
                />
                <div className="flex-grow">
                  <div className="flex items-center mb-2">
                    {candidate.image ? (
                      <img
                        src={candidate.image || "/placeholder.svg"} // Using placeholder.svg for consistency
                        alt={candidate.name}
                        className="h-12 w-12 rounded-full mr-3 object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
                        <FaUser size={24} />
                      </div>
                    )}
                    <div>
                      <span className="font-semibold text-lg text-gray-800">{candidate.name}</span>
                      <p className="text-sm text-gray-500">{candidate.position}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{candidate.description}</p>
                </div>
              </label>
            ))}
          </div>
          <div className="mt-8 flex justify-between items-center">
            <button onClick={() => navigate("/dashboard")} className="btn text-gray-700 bg-gray-100 hover:bg-gray-200">
              Cancel
            </button>
            <button
              onClick={handleVoteSubmit}
              disabled={isSubmitting || !selectedCandidateId || election.status !== "active"}
              className="btn btn-primary disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : election.status !== "active" ? "Voting Closed" : "Submit Vote"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VotePage
