"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext"
import { API_URL } from "../../config"
import { toast } from "react-toastify"
import Spinner from "../../components/layout/Spinner"
import {
  FaArrowLeft,
  FaEdit,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa"

const ViewUserPage = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { token } = useContext(AuthContext)

  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true)
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } }
        const res = await axios.get(`${API_URL}/api/users/${userId}`, config)
        setUser(res.data.data)
      } catch (error) {
        toast.error("Failed to fetch user details.")
        console.error("Fetch user error:", error)
        navigate("/admin/users")
      }
      setIsLoading(false)
    }
    if (token && userId) {
      fetchUser()
    }
  }, [userId, token, navigate])

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", icon: FaCheckCircle, text: "Active" },
      inactive: { color: "bg-red-100 text-red-800", icon: FaTimesCircle, text: "Inactive" },
      pending: { color: "bg-yellow-100 text-yellow-800", icon: FaClock, text: "Pending" },
      suspended: { color: "bg-orange-100 text-orange-800", icon: FaExclamationTriangle, text: "Suspended" },
    }

    const config = statusConfig[status] || statusConfig.inactive
    const IconComponent = config.icon

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <IconComponent className="mr-1 h-3 w-3" />
        {config.text}
      </span>
    )
  }

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { color: "bg-purple-100 text-purple-800", text: "Administrator" },
      voter: { color: "bg-blue-100 text-blue-800", text: "Voter" },
    }

    const config = roleConfig[role] || roleConfig.voter

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <FaShieldAlt className="mr-1 h-3 w-3" />
        {config.text}
      </span>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided"
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) return <Spinner />

  if (!user) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <FaExclamationTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">User Not Found</h1>
        <p className="text-gray-600 mb-6">The requested user could not be found.</p>
        <button onClick={() => navigate("/admin/users")} className="btn btn-primary">
          Back to Users
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center">
                  <FaUser className="mr-3" />
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-indigo-100 mt-2">User Profile Details</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate("/admin/users")}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                >
                  <FaArrowLeft className="mr-2" />
                  Back
                </button>
                <Link
                  to={`/admin/users/edit/${user._id}`}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                >
                  <FaEdit className="mr-2" />
                  Edit
                </Link>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaUser className="mr-2 text-blue-500" />
                Basic Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-lg text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <FaEnvelope className="mr-1" />
                      Email Address
                    </label>
                    <p className="text-lg text-gray-900">{user.email}</p>
                    {user.isEmailVerified && (
                      <span className="inline-flex items-center text-sm text-green-600 mt-1">
                        <FaCheckCircle className="mr-1" />
                        Email Verified
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <FaPhone className="mr-1 rotate-90" />
                      Phone Number
                    </label>
                    <p className="text-lg text-gray-900">{user.phoneNumber || "Not provided"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <FaCalendarAlt className="mr-1" />
                      Date of Birth
                    </label>
                    <p className="text-lg text-gray-900">{formatDate(user.dateOfBirth)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Role</label>
                    <div className="mt-1">{getRoleBadge(user.role)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">{getStatusBadge(user.status)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            {user.address && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-green-500" />
                  Address Information
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Street Address</label>
                      <p className="text-lg text-gray-900">{user.address.street || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">City</label>
                      <p className="text-lg text-gray-900">{user.address.city || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">State/Province</label>
                      <p className="text-lg text-gray-900">{user.address.state || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">ZIP Code</label>
                      <p className="text-lg text-gray-900">{user.address.zipCode || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-500">Country</label>
                  <p className="text-lg text-gray-900">{user.address.country || "Not provided"}</p>
                </div>
              </div>
            )}

            {/* ID Verification */}
            {user.idVerification && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FaIdCard className="mr-2 text-purple-500" />
                  ID Verification
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">ID Type</label>
                      <p className="text-lg text-gray-900 capitalize">
                        {user.idVerification.idType?.replace("_", " ") || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">ID Number</label>
                      <p className="text-lg text-gray-900 font-mono">
                        {user.idVerification.idNumber || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Expiry Date</label>
                      <p className="text-lg text-gray-900">{formatDate(user.idVerification.expiryDate)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Verification Status</label>
                      <div className="mt-1">
                        {user.idVerification.isVerified ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <FaCheckCircle className="mr-1 h-3 w-3" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                            <FaTimesCircle className="mr-1 h-3 w-3" />
                            Not Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Account Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaClock className="mr-2 text-orange-500" />
                Account Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">User ID</label>
                  <p className="text-lg text-gray-900 font-mono">{user._id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Registration Date</label>
                  <p className="text-lg text-gray-900">{formatDate(user.createdAt)}</p>
                </div>
              </div>

              {user.lastLogin && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-500">Last Login</label>
                  <p className="text-lg text-gray-900">{formatDate(user.lastLogin)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewUserPage
