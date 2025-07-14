"use client"

// Content from previous ResultsPage.js, converted to JSX and types removed
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
  const [verificationStatus, setVerificationStatus] = useState(null) // null, 'success', 'error'
  const [verificationMessage, setVerificationMessage] = useState("")
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true)
      try {
        const res = await axios.get(`${API_URL}/api/elections/${electionId}/results`)
        setResults(res.data.data)
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
      if (results && results.verifiedVotes) {
        const isVerified = results.verifiedVotes.includes(verificationCode.trim())
        if (isVerified) {
          setVerificationStatus("success")
          setVerificationMessage("Your vote has been verified and was counted in the final results.")
        } else {
          setVerificationStatus("error")
          setVerificationMessage("The verification code you entered was not found.")
        }
      } else {
        toast.info("Verification data not available for client-side check.")
        setVerificationStatus("error")
        setVerificationMessage("Could not perform verification at this time.")
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

  const barChartData = results.candidates.map((c) => ({ name: c.name, votes: c.votes }))
  const pieChartData = results.candidates.map((c) => ({ name: c.name, value: c.votes }))

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{results.title} - Election Results</h1>
        <p className="text-lg text-gray-600">{results.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <FaPoll className="mx-auto h-10 w-10 text-primary mb-2" />
          <p className="text-3xl font-semibold text-gray-900">{results.totalVotes}</p>
          <p className="text-sm font-medium text-gray-500">Total Votes Cast</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <FaUsers className="mx-auto h-10 w-10 text-secondary mb-2" />
          <p className="text-3xl font-semibold text-gray-900">{results.candidates.length}</p>
          <p className="text-sm font-medium text-gray-500">Candidates</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <FaChartPie className="mx-auto h-10 w-10 text-accent mb-2" />
          <p className="text-sm font-medium text-gray-500">Voting Period</p>
          <p className="text-xs text-gray-700">{formatDate(results.startDate)}</p>
          <p className="text-xs text-gray-500">to</p>
          <p className="text-xs text-gray-700">{formatDate(results.endDate)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Vote Distribution (Bar Chart)</h2>
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
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Percentage Breakdown (Pie Chart)</h2>
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

      <div className="bg-white p-6 rounded-xl shadow-lg mb-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Detailed Results Table</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
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
              {results.candidates
                .sort((a, b) => b.votes - a.votes)
                .map((candidate, index) => (
                  <tr key={candidate.id} className={index === 0 ? "bg-green-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{candidate.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{candidate.votes}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {candidate.percentage.toFixed(2)}%
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

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
            className={`mt-4 p-3 rounded-md flex items-center text-sm ${verificationStatus === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
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
