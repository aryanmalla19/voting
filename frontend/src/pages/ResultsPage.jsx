"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../config"
import { toast } from "react-toastify"
import {
  FaExclamationCircle,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaPoll,
  FaChartPie,
  FaUsers,
  FaTrophy,
  FaBriefcase,
  FaMedal,
} from "react-icons/fa"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import Spinner from "../components/layout/Spinner"

const COLORS = ["#8b5cf6", "#6366f1", "#ec4899", "#f43f5e", "#f97316", "#eab308", "#10b981", "#3b82f6"]

const ResultsPage = () => {
  const { id: electionId } = useParams()
  const navigate = useNavigate()

  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [verificationCode, setVerificationCode] = useState("")
  const [verificationStatus, setVerificationStatus] = useState(null)
  const [verificationMessage, setVerificationMessage] = useState("")
  const [error, setError] = useState(null)
  const [selectedPosition, setSelectedPosition] = useState(0)

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true)
      try {
        const res = await axios.get(`${API_URL}/api/elections/${electionId}/results`)
        setResults(res.data.data)
        console.log(res.data.data.status);
      } catch (err) {
        setError(err.response?.data?.message || "Results not found or not available yet.")
        toast.error(err.response?.data?.message || "Failed to load results.")
      }
      setIsLoading(false)
    }
    fetchResults()
  }, [electionId])

  const handleVerifyVote = async () => {
    if (!verificationCode.trim()) {
      toast.error("Please enter a verification code.")
      return
    }
    try {
      const res = await axios.post(`${API_URL}/api/votes/verify`, {
        electionId,
        verificationCode: verificationCode.trim(),
      })

      if (res.data.success) {
        setVerificationStatus("success")
        setVerificationMessage("Your vote has been verified and was counted in the final results.")
      } else {
        setVerificationStatus("error")
        setVerificationMessage("The verification code you entered was not found.")
      }
    } catch (err) {
      setVerificationStatus("error")
      setVerificationMessage(err.response?.data?.message || "Error verifying vote.")
    }
  }

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const getTotalVotes = () => {
    if (!results?.positions) return 0
    return results.positions.reduce((total, position) => {
      return total + position.candidates.reduce((posTotal, candidate) => posTotal + candidate.votes, 0)
    }, 0)
  }

  const getTotalCandidates = () => {
    if (!results?.positions) return 0
    return results.positions.reduce((total, position) => total + position.candidates.length, 0)
  }

  const getWinner = (position) => {
    if (!position.candidates || position.candidates.length === 0) return null
    return position.candidates.reduce((winner, candidate) => (candidate.votes > winner.votes ? candidate : winner))
  }

  if (isLoading) return <Spinner />

  if (error || !results) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <FaExclamationCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Results Not Available</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <button onClick={() => navigate("/dashboard")} className="btn btn-primary">
          Return to Dashboard
        </button>
      </div>
    )
  }

  const currentPosition = results.positions[selectedPosition]
  const barChartData = currentPosition?.candidates.map((c) => ({ name: c.name, votes: c.votes })) || []
  const pieChartData = currentPosition?.candidates.map((c) => ({ name: c.name, value: c.votes })) || []

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{results.title} - Election Results</h1>
        <p className="text-lg text-gray-600">{results.description}</p>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <FaPoll className="mx-auto h-10 w-10 text-primary mb-2" />
          <p className="text-3xl font-semibold text-gray-900">{getTotalVotes()}</p>
          <p className="text-sm font-medium text-gray-500">Total Votes Cast</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <FaBriefcase className="mx-auto h-10 w-10 text-secondary mb-2" />
          <p className="text-3xl font-semibold text-gray-900">{results.positions.length}</p>
          <p className="text-sm font-medium text-gray-500">Positions</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <FaUsers className="mx-auto h-10 w-10 text-accent mb-2" />
          <p className="text-3xl font-semibold text-gray-900">{getTotalCandidates()}</p>
          <p className="text-sm font-medium text-gray-500">Total Candidates</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <FaChartPie className="mx-auto h-10 w-10 text-purple-500 mb-2" />
          <p className="text-sm font-medium text-gray-500">Voting Period</p>
          <p className="text-xs text-gray-700">{formatDate(results.startDate)}</p>
          <p className="text-xs text-gray-500">to</p>
          <p className="text-xs text-gray-700">{formatDate(results.endDate)}</p>
        </div>
      </div>

      {
        results.status === "completed" && (
            <>
            {/* Winners Summary */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 mb-12 border border-yellow-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <FaTrophy className="mr-3 text-yellow-500" />
                  Election Winners
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.positions.map((position, index) => {
                    const winner = getWinner(position)
                    return (
                      <div key={index} className="bg-white rounded-lg p-4 shadow-md border border-yellow-100">
                        <div className="flex items-center mb-3">
                          <FaMedal className="text-yellow-500 mr-2" />
                          <h3 className="font-semibold text-gray-800">{position.title}</h3>
                        </div>
                        {winner ? (
                          <div className="text-center">
                            {winner.photo && (
                              <img
                                src={`${API_URL}/${winner.photo || "placeholder.svg"}`}
                                alt={winner.name}
                                className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
                              />
                            )}
                            <p className="font-bold text-lg text-gray-900">{winner.name}</p>
                            <p className="text-sm text-gray-600">{winner.symbol}</p>
                            <p className="text-lg font-semibold text-green-600">{winner.votes} votes</p>
                            <p className="text-sm text-gray-500">({winner.percentage.toFixed(1)}%)</p>
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center">No votes cast</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Position Selector */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">View Results by Position</h2>
                <div className="flex flex-wrap gap-2">
                  {results.positions.map((position, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPosition(index)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedPosition === index ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {position.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Position-specific Results */}
              {currentPosition && (
                <>
                  <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">{currentPosition.title} Results</h2>
                    <p className="text-gray-600 mb-4">{currentPosition.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {currentPosition.candidates.reduce((sum, c) => sum + c.votes, 0)}
                        </p>
                        <p className="text-sm text-blue-800">Total Votes</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-green-600">{currentPosition.candidates.length}</p>
                        <p className="text-sm text-green-800">Candidates</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-purple-600">{getWinner(currentPosition)?.name || "TBD"}</p>
                        <p className="text-sm text-purple-800">Winner</p>
                      </div>
                    </div>
                  </div>

                  {/* Charts for Current Position */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        {currentPosition.title} - Vote Distribution (Bar Chart)
                      </h3>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={barChartData} margin={{ top: 5, right: 20, left: -20, bottom: 50 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} style={{ fontSize: "0.75rem" }} />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="votes" fill="#8b5cf6" name="Votes" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        {currentPosition.title} - Percentage Breakdown (Pie Chart)
                      </h3>
                      <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                            style={{ fontSize: "0.75rem" }}
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value, name) => [`${value} votes`, name]} />
                          <Legend wrapperStyle={{ fontSize: "0.8rem" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Detailed Results Table for Current Position */}
                  <div className="bg-white p-6 rounded-xl shadow-lg mb-12">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">{currentPosition.title} - Detailed Results</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Rank
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Photo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Candidate
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Symbol
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Votes
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Percentage
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {currentPosition.candidates
                            .sort((a, b) => b.votes - a.votes)
                            .map((candidate, index) => (
                              <tr key={candidate.candidateId} className={index === 0 ? "bg-green-50" : ""}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  <div className="flex items-center">
                                    {index === 0 && <FaTrophy className="text-yellow-500 mr-2" />}
                                    {index + 1}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {candidate.photo ? (
                                    <img
                                      src={`${API_URL}/${candidate.photo || "placeholder.svg"}`}
                                      alt={candidate.name}
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                      <FaUsers className="text-gray-400" />
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                  {candidate.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <span className="text-2xl">{candidate.symbol}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                                  {candidate.votes}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  <div className="flex items-center">
                                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                      <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${candidate.percentage}%` }}
                                      ></div>
                                    </div>
                                    {candidate.percentage.toFixed(2)}%
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </>
          )
        }

      {/* Vote Verification */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Verify Your Vote</h2>
        <p className="text-sm text-gray-600 mb-4">Enter your verification code to confirm your vote was counted.</p>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
            className="form-input flex-grow"
          />
          <button onClick={handleVerifyVote} className="btn btn-primary w-full sm:w-auto">
            <FaSearch className="mr-2" /> Verify
          </button>
        </div>
        {verificationStatus && (
          <div
            className={`mt-4 p-3 rounded-md flex items-center text-sm ${
              verificationStatus === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            {verificationStatus === "success" ? (
              <FaCheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <FaTimesCircle className="h-5 w-5 mr-2" />
            )}
            <span>{verificationMessage}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResultsPage
