"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext"
import { API_URL } from "../../config"
import { FaUsers, FaVoteYea, FaChartBar, FaPlus, FaUserCheck, FaClock, FaCheckCircle } from "react-icons/fa"
import Spinner from "../../components/layout/Spinner"

const StatCard = ({ icon, title, value, subtitle, color = "primary" }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <div className="flex items-center">
      <div className={`text-${color} text-3xl mr-4`}>{icon}</div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-gray-600 font-medium">{title}</p>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
  </div>
)

const AdminDashboardPage = () => {
  const { token } = useContext(AuthContext)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      const response = await axios.get(`${API_URL}/api/admin/stats`, config)
      setStats(response.data.data)
    } catch (error) {
      setError("Failed to fetch dashboard statistics")
      console.error("Fetch stats error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Spinner />

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-dark">Admin Dashboard</h1>
        <p className="text-neutral mt-2">Manage users, elections, and monitor system activity</p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/admin/elections/create"
          className="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center"
        >
          <FaPlus className="text-2xl mr-4" />
          <div>
            <h3 className="text-xl font-semibold">Create Election</h3>
            <p className="text-sm opacity-90">Set up a new voting election</p>
          </div>
        </Link>

        <Link
          to="/admin/users"
          className="bg-white border-2 border-primary text-primary p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center hover:bg-primary hover:text-white"
        >
          <FaUsers className="text-2xl mr-4" />
          <div>
            <h3 className="text-xl font-semibold">Manage Users</h3>
            <p className="text-sm opacity-75">View and manage user accounts</p>
          </div>
        </Link>

        <Link
          to="/admin/elections"
          className="bg-white border-2 border-secondary text-secondary p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center hover:bg-secondary hover:text-white"
        >
          <FaVoteYea className="text-2xl mr-4" />
          <div>
            <h3 className="text-xl font-semibold">Manage Elections</h3>
            <p className="text-sm opacity-75">View and manage elections</p>
          </div>
        </Link>
      </div>

      {/* Statistics */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-dark mb-6">System Statistics</h2>

        {/* User Stats */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">User Statistics</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to={"/admin/users"}>
              <StatCard 
              icon={<FaUsers />} 
              title="Total Users" 
              value={stats?.users?.total || 0} 
              subtitle={"All registered users"}
              color="blue-500" />
            </Link>
            <Link to={"/admin/users?status=active"}>
              <StatCard
                icon={<FaUserCheck />}
                title="Active Users"
                value={stats?.users?.active || 0}
                subtitle="Verified & Active"
                color="green-500"
              />
            </Link>
            <Link to={"/admin/users?status=pending"}>
              <StatCard
              icon={<FaClock />}
              title="Pending Users"
              value={stats?.users?.pending || 0}
              subtitle="Awaiting Verification"
              color="yellow-500"
              />
            </Link>
            <StatCard
              icon={<FaCheckCircle />}
              title="Verified Users"
              value={stats?.users?.verified || 0}
              subtitle="Email Verified"
              color="purple-500"
            />
          </div>
        </div>

        {/* Election Stats */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Election Statistics</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<FaVoteYea />}
              title="Total Elections"
              value={stats?.elections?.total || 0}
              color="indigo-500"
            />
            <StatCard
              icon={<FaChartBar />}
              title="Active Elections"
              value={stats?.elections?.active || 0}
              subtitle="Currently Running"
              color="green-500"
            />
            <StatCard
              icon={<FaClock />}
              title="Upcoming Elections"
              value={stats?.elections?.upcoming || 0}
              subtitle="Scheduled"
              color="blue-500"
            />
            <StatCard
              icon={<FaCheckCircle />}
              title="Completed Elections"
              value={stats?.elections?.completed || 0}
              subtitle="Finished"
              color="gray-500"
            />
          </div>
        </div>

        {/* Vote Stats */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Voting Statistics</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <StatCard icon={<FaVoteYea />} title="Total Votes Cast" value={stats?.votes?.total || 0} color="primary" />
            <StatCard
              icon={<FaChartBar />}
              title="Votes Today"
              value={stats?.votes?.today || 0}
              subtitle="Last 24 hours"
              color="secondary"
            />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">Recent Users</h3>
          <div className="space-y-3">
            {stats?.recentActivity?.users?.length > 0 ? (
              stats.recentActivity.users.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : user.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No recent users</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">Recent Elections</h3>
          <div className="space-y-3">
            {stats?.recentActivity?.elections?.length > 0 ? (
              stats.recentActivity.elections.map((election) => (
                <div key={election._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-gray-900">{election.title}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(election.startDate).toLocaleDateString()} -{" "}
                      {new Date(election.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      election.status === "active"
                        ? "bg-green-100 text-green-800"
                        : election.status === "upcoming"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {election.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No recent elections</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
