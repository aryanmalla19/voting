"use client"

// Content from previous DashboardPage.js, converted to JSX and types removed
import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../context/AuthContext"
import { API_URL } from "../config"
import { toast } from "react-toastify"
import { FaVoteYea, FaClock, FaCheckCircle, FaCalendarAlt, FaListAlt } from "react-icons/fa"
import Spinner from "../components/layout/Spinner"

const StatCard = ({ title, value, icon, colorClass }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-semibold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${colorClass} text-white`}>{icon}</div>
    </div>
  </div>
)

const ElectionCard = ({ election, formatDate, getStatusBadge, showVoteButton, showResultsButton }) => (
  <div className="bg-white shadow-lg rounded-xl overflow-hidden transition-all hover:shadow-2xl">
    <div className="p-6">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold text-gray-900">{election.title}</h3>
        {getStatusBadge(election.status)}
      </div>
      <p className="text-sm text-gray-600 mb-4 h-16 overflow-hidden">{election.description}</p>

      <div className="space-y-2 text-sm text-gray-500 mb-4">
        <div className="flex items-center">
          <FaCalendarAlt className="mr-2 text-primary" />
          <span>Start: {formatDate(election.startDate)}</span>
        </div>
        <div className="flex items-center">
          <FaCalendarAlt className="mr-2 text-primary" />
          <span>End: {formatDate(election.endDate)}</span>
        </div>
      </div>

      {election.candidates?.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Candidates:</h4>
          <div className="flex flex-wrap gap-2">
            {election.candidates.slice(0, 3).map((candidate, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                {candidate.name}
              </span>
            ))}
            {election.candidates.length > 3 && (
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                +{election.candidates.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
    <div className="bg-gray-50 px-6 py-4 flex justify-end items-center">
      {showVoteButton && (
        <Link to={`/vote/${election._id}`} className="btn btn-primary text-sm py-2 px-4 flex items-center">
          <FaVoteYea className="mr-2" /> Vote Now
        </Link>
      )}
      {showResultsButton && (
        <Link to={`/results/${election._id}`} className="btn btn-outline-primary text-sm py-2 px-4">
          View Results
        </Link>
      )}
      {!showVoteButton && !showResultsButton && election.status === "upcoming" && (
        <button className="btn text-sm py-2 px-4 bg-gray-200 text-gray-500 cursor-not-allowed" disabled>
          <FaClock className="mr-2" /> Not Started
        </button>
      )}
    </div>
  </div>
)

const DashboardPage = () => {
  const { user } = useContext(AuthContext)
  const [elections, setElections] = useState({ active: [], upcoming: [], completed: [] })
  const [votingHistory, setVotingHistory] = useState([])
  const [activeTab, setActiveTab] = useState("active")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [electionsRes, historyRes] = await Promise.all([
          axios.get(`${API_URL}/api/elections`),
          axios.get(`${API_URL}/api/votes/history`),
        ])

        setElections({
          active: electionsRes.data.data.filter((e) => e.status === "active"),
          upcoming: electionsRes.data.data.filter((e) => e.status === "upcoming"),
          completed: electionsRes.data.data.filter((e) => e.status === "completed"),
        })
        setVotingHistory(historyRes.data.data)
      } catch (error) {
        toast.error("Error fetching dashboard data. Please try again.")
        console.error("Dashboard fetch error:", error)
      }
      setIsLoading(false)
    }
    fetchData()
  }, [])

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const getStatusBadge = (status) => {
    const baseClasses = "text-xs font-semibold px-2.5 py-0.5 rounded-full"
    if (status === "active") return <span className={`${baseClasses} bg-green-100 text-green-800`}>Active</span>
    if (status === "upcoming") return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Upcoming</span>
    if (status === "completed") return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Completed</span>
    return null
  }

  const tabs = [
    { name: "active", label: "Active Elections", data: elections.active },
    { name: "upcoming", label: "Upcoming Elections", data: elections.upcoming },
    { name: "completed", label: "Completed Elections", data: elections.completed },
    { name: "history", label: "Voting History", data: votingHistory },
  ]

  const currentTabData = tabs.find((tab) => tab.name === activeTab)?.data

  if (isLoading) return <Spinner />

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="page-title">Voter Dashboard</h1>
      <p className="text-center text-gray-600 mb-10 -mt-6">
        Welcome back, {user?.firstName}! Manage your voting activities here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard
          title="Active Elections"
          value={elections.active.length}
          icon={<FaVoteYea size={24} />}
          colorClass="bg-green-500"
        />
        <StatCard
          title="Upcoming Elections"
          value={elections.upcoming.length}
          icon={<FaClock size={24} />}
          colorClass="bg-blue-500"
        />
        <StatCard
          title="Votes Cast"
          value={votingHistory.length}
          icon={<FaCheckCircle size={24} />}
          colorClass="bg-primary"
        />
      </div>

      <div className="mb-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`${
                activeTab === tab.name
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div>
        {currentTabData && currentTabData.length > 0 ? (
          activeTab === "history" ? (
            <div className="space-y-6">
              {votingHistory.map((vote) => (
                <div key={vote.id} className="bg-white shadow-lg rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900">{vote.electionTitle}</h3>
                  <p className="text-sm text-gray-500 mt-1">Voted on: {formatDate(vote.votedOn)}</p>
                  <p className="text-sm text-gray-700 mt-3">
                    Verification Code:{" "}
                    <span className="font-mono bg-gray-100 p-1 rounded">{vote.verificationCode}</span>
                  </p>
                  <div className="mt-4">
                    <Link to={`/results/${vote.electionId}`} className="btn btn-outline-primary text-sm">
                      View Results
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentTabData.map((election) => (
                <ElectionCard
                  key={election._id}
                  election={election}
                  formatDate={formatDate}
                  getStatusBadge={getStatusBadge}
                  showVoteButton={activeTab === "active"}
                  showResultsButton={activeTab === "completed"}
                />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <FaListAlt className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No {activeTab === "history" ? "voting history" : `${activeTab} elections`}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === "history"
                ? "You haven't voted in any elections yet."
                : `There are currently no ${activeTab} elections.`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
