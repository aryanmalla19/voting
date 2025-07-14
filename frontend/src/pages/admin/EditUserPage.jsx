"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext"
import { API_URL } from "../../config"
import { toast } from "react-toastify"
import Spinner from "../../components/layout/Spinner"
import { FaSave, FaTimes } from "react-icons/fa"

const EditUserPage = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { token } = useContext(AuthContext)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "voter",
    status: "active", // Assuming you have a status field
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true)
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } }
        const res = await axios.get(`${API_URL}/api/users/${userId}`, config)
        const userData = res.data.data
        setFormData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: userData.role,
          status: userData.status || "active", // Default if status is not present
        })
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } }
      await axios.put(`${API_URL}/api/users/${userId}`, formData, config)
      toast.success("User updated successfully!")
      navigate("/admin/users")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user.")
      console.error("Update user error:", error)
    }
    setIsSubmitting(false)
  }

  if (isLoading) return <Spinner />

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-neutral-dark mb-6">Edit User</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              className="form-input"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              className="form-input"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <select name="role" id="role" className="form-input" value={formData.role} onChange={handleChange}>
              <option value="voter">Voter</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select name="status" id="status" className="form-input" value={formData.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              {/* Add other statuses if applicable, e.g., 'pending', 'suspended' */}
            </select>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className="btn btn-neutral flex items-center"
              disabled={isSubmitting}
            >
              <FaTimes className="mr-2" /> Cancel
            </button>
            <button type="submit" className="btn btn-primary flex items-center" disabled={isSubmitting || isLoading}>
              <FaSave className="mr-2" /> {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditUserPage
