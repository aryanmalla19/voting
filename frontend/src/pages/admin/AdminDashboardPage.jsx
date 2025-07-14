"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext"
import { API_URL } from "../../config"
import { toast } from "react-toastify"
import { FaUsers, FaPoll, FaPlusCircle, FaChartBar } from "react-icons/fa"
import Spinner from "../../components/layout/Spinner" // Assuming Spinner.jsx is in this path

const StatCard = ({ title, value, icon, linkTo, bgColorClass = "bg-primary" }) => (
  <Link
    to={linkTo}
    className={`block p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow text-white ${bgColorClass}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-3xl font-semibold">{value === null ? "..." : value}</p>
        <p className="text-sm font-medium uppercase tracking-wider">{title}</p>
      </div>
      <div className="p-3 rounded-full bg-white/20">{icon}</div>
    </div>
  </Link>
)

const ActionCard = ({
  title,
  description,
  icon,
  linkTo,
  linkText,
  bgColorClass = "bg-white",
  textColorClass = "text-neutral-dark",
}) => (
  <div className={`p-6 rounded-xl shadow-lg ${bgColorClass} ${textColorClass}`}>
    <div className="flex items-center mb-3">
      <div
        className={`p-2 mr-3 rounded-full ${
          textColorClass === "text-neutral-dark" ? "bg-primary/10 text-primary" : "bg-white/20 text-white"
        }`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    <p className="text-sm mb-4 h-12 overflow-hidden">{description}</p>
    <Link
      to={linkTo}
      className={`btn btn-sm ${
        textColorClass === "text-neutral-dark" ? "btn-primary" : "bg-white text-primary hover:bg-gray-100"
      } w-full`}
    >
      {linkText}
    </Link>
  </div>
)

const AdminDashboardPage = () => {
  const { token } = useContext(AuthContext)
  const [stats, setStats] = useState({
    totalUsers: null,
    totalElections: null,
    activeElections: null,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        const res = await axios.get(`${API_URL}/api/admin/stats`, config)
        setStats(res.data.data)
      } catch (error) {
        toast.error("Failed to fetch dashboard statistics.")
        console.error("Fetch stats error:", error)
        setStats({ totalUsers: "N/A", totalElections: "N/A", activeElections: "N/A" })
      }
      setIsLoading(false)
    }

    if (token) {
      fetchStats()
    } else {
      setIsLoading(false)
      toast.warn("Admin token not found. Please log in as admin.")
    }
  }, [token])

  if (isLoading) return <Spinner />

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="page-title mb-10">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<FaUsers size={28} />}
          linkTo="/admin/users"
          bgColorClass="bg-secondary"
        />
        <StatCard
          title="Total Elections"
          value={stats.totalElections}
          icon={<FaPoll size={28} />}
          linkTo="/admin/elections"
          bgColorClass="bg-accent"
        />
        <StatCard
          title="Active Elections"
          value={stats.activeElections}
          icon={<FaChartBar size={28} />}
          linkTo="/admin/elections?status=active" // This query param is for frontend filtering if needed
        />
      </div>

      <h2 className="text-2xl font-semibold text-neutral-dark mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ActionCard
          title="Manage Users"
          description="View, edit, and manage user accounts and roles."
          icon={<FaUsers size={24} />}
          linkTo="/admin/users"
          linkText="Go to User Management"
        />
        <ActionCard
          title="Manage Elections"
          description="Create, view, edit, and manage all elections in the system."
          icon={<FaPoll size={24} />}
          linkTo="/admin/elections"
          linkText="Go to Election Management"
        />
        <ActionCard
          title="Create New Election"
          description="Set up a new election, define candidates, and schedule voting periods."
          icon={<FaPlusCircle size={24} />}
          linkTo="/admin/elections/create"
          linkText="Create Election"
          bgColorClass="bg-green-500"
          textColorClass="text-white"
        />
      </div>
    </div>
  )
}

export default AdminDashboardPage
