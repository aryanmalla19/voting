"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext"
import { API_URL } from "../../config"
import { toast } from "react-toastify"
import { FaEdit, FaTrashAlt, FaUserPlus, FaSearch, FaUsers } from "react-icons/fa"
import Spinner from "../../components/layout/Spinner"
import ConfirmationModal from "../../components/common/ConfirmationModal"

const ManageUsersPage = () => {
  const { token } = useContext(AuthContext)
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        const res = await axios.get(`${API_URL}/api/users`, config)
        setUsers(res.data.data)
      } catch (error) {
        toast.error("Failed to fetch users.")
        console.error("Fetch users error:", error)
        setUsers([])
      }
      setIsLoading(false)
    }

    if (token) {
      fetchUsers()
    } else {
      setIsLoading(false)
      toast.error("Authentication token not found. Please log in.")
    }
  }, [token])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase())
  }

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.lastName.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm),
  )

  const openDeleteModal = (user) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setUserToDelete(null)
    setShowDeleteModal(false)
  }

  const confirmDeleteUser = async () => {
    if (!userToDelete) return
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      await axios.delete(`${API_URL}/api/users/${userToDelete._id}`, config)
      setUsers(users.filter((user) => user._id !== userToDelete._id))
      toast.success(`User ${userToDelete.firstName} ${userToDelete.lastName} deleted successfully.`)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user.")
      console.error("Delete user error:", error)
    }
    closeDeleteModal()
  }

  if (isLoading) return <Spinner />

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-dark mb-4 sm:mb-0">Manage Users</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="form-input pl-10 w-full sm:w-64"
              onChange={handleSearch}
              value={searchTerm}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <Link to="/admin/users/create" className="btn btn-primary flex items-center">
            <FaUserPlus className="mr-2" /> Add User
          </Link>
        </div>
      </div>

      {filteredUsers.length === 0 && !isLoading ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <FaUsers className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No Users Found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? "No users match your search criteria." : "There are no users in the system yet."}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "admin" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : user.status === "inactive"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800" // Default for other statuses
                      }`}
                    >
                      {user.status || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link to={`/admin/users/edit/${user._id}`} className="text-primary hover:text-primary-hover">
                      <FaEdit className="inline h-5 w-5" title="Edit User" />
                    </Link>
                    <button onClick={() => openDeleteModal(user)} className="text-red-600 hover:text-red-800">
                      <FaTrashAlt className="inline h-5 w-5" title="Delete User" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete user ${userToDelete?.firstName} ${userToDelete?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  )
}

export default ManageUsersPage
