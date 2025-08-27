"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext"
import { API_URL } from "../../config"
import { toast } from "react-toastify"
import Spinner from "../../components/layout/Spinner"
import {
  FaSave,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaEdit,
} from "react-icons/fa"

const EditUserPage = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { token } = useContext(AuthContext)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    role: "voter",
    status: "active",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    idVerification: {
      idType: "",
      idNumber: "",
      expiryDate: "",
      isVerified: false,
    },
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
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phoneNumber: userData.phoneNumber || "",
          dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split("T")[0] : "",
          role: userData.role || "voter",
          status: userData.status || "active",
          address: {
            street: userData.address?.street || "",
            city: userData.address?.city || "",
            state: userData.address?.state || "",
            zipCode: userData.address?.zipCode || "",
            country: userData.address?.country || "",
          },
          idVerification: {
            idType: userData?.idType || "",
            idNumber: userData?.idNumber || "",
            expiryDate: userData?.idExpiryDate
              ? new Date(userData.idExpiryDate).toISOString().split("T")[0]
              : "",
            isVerified: userData?.isEmailVerified || false,
          },
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
    const { name, value, type, checked } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }))
    }
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
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Failed to update user.")
      console.error("Update user error:", error)
    }
    setIsSubmitting(false)
  }

  if (isLoading) return <Spinner />

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white flex items-center">
              <FaEdit className="mr-3" />
              Edit User Profile
            </h1>
            <p className="text-blue-100 mt-2">Update user information and verification status</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Personal Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaUser className="mr-2 text-blue-500" />
                Personal Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="">
                    First Name *
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
                  <label htmlFor="lastName" className="">
                    Last Name *
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
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label htmlFor="email" className="flex items-center">
                    <FaEnvelope className="mr-2 text-green-500" />
                    Email Address *
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
                  <label htmlFor="phoneNumber" className=" flex items-center">
                    <FaPhone className="mr-2 rotate-90 text-orange-500" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    className="form-input"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-4">
                <div>
                  <label htmlFor="dateOfBirth" className=" flex items-center">
                    <FaCalendarAlt className="mr-2 text-purple-500" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    className="form-input"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="role" className=" flex items-center">
                    <FaShieldAlt className="mr-2 text-red-500" />
                    Role
                  </label>
                  <select name="role" id="role" className="form-input" value={formData.role} onChange={handleChange}>
                    <option value="voter">Voter</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="status" className="">
                    Status
                  </label>
                  <select
                    name="status"
                    id="status"
                    className="form-input"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-green-500" />
                Address Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="address.street" className="">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    id="address.street"
                    className="form-input"
                    value={formData.address.street}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="address.city" className="">
                      City
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      id="address.city"
                      className="form-input"
                      value={formData.address.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="address.state" className="">
                      State/Province
                    </label>
                    <input
                      type="text"
                      name="address.state"
                      id="address.state"
                      className="form-input"
                      value={formData.address.state}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="address.zipCode" className="">
                      ZIP/Postal Code
                    </label>
                    <input
                      type="text"
                      name="address.zipCode"
                      id="address.zipCode"
                      className="form-input"
                      value={formData.address.zipCode}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="address.country" className="">
                      Country
                    </label>
                    <input
                      type="text"
                      name="address.country"
                      id="address.country"
                      className="form-input"
                      value={formData.address.country}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ID Verification */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaIdCard className="mr-2 text-purple-500" />
                ID Verification
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="idVerification.idType" className="">
                    ID Type
                  </label>
                  <select
                    name="idVerification.idType"
                    id="idVerification.idType"
                    className="form-input"
                    value={formData.idVerification.idType}
                    onChange={handleChange}
                  >
                    {/* <option value="">Select ID Type</option> */}
                    <option value="passport">Passport</option>
                    <option value="drivers_license">Driver's License</option>
                    <option value="national_id">National ID</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="idVerification.idNumber" className="">
                    ID Number
                  </label>
                  <input
                    type="text"
                    name="idVerification.idNumber"
                    id="idVerification.idNumber"
                    className="form-input"
                    value={formData.idVerification.idNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label htmlFor="idVerification.expiryDate" className="">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    name="idVerification.expiryDate"
                    id="idVerification.expiryDate"
                    className="form-input"
                    value={formData.idVerification.expiryDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex items-center mt-8">
                  <input
                    type="checkbox"
                    name="idVerification.isVerified"
                    id="idVerification.isVerified"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    checked={formData.idVerification.isVerified}
                    onChange={handleChange}
                  />
                  <label htmlFor="idVerification.isVerified" className="ml-2 block text-sm text-gray-900">
                    Email Verified
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="btn btn-neutral flex items-center"
                disabled={isSubmitting}
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>
              <button type="submit" className="btn btn-primary flex items-center" disabled={isSubmitting || isLoading}>
                <FaSave className="mr-2" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditUserPage
