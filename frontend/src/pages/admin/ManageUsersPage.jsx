"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext"
import { API_URL } from "../../config"
import { toast } from "react-toastify"
import { FaSearch, FaEdit, FaTrashAlt, FaUserPlus, FaFilter, FaEye } from "react-icons/fa"
import Spinner from "../../components/layout/Spinner"
import ConfirmationModal from "../../components/common/ConfirmationModal"

const ManageUsersPage = () => {
  const queryParams = new URLSearchParams(location.search);
  const defaultStatus = queryParams.get("status") || "";

  const { token } = useContext(AuthContext)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState(defaultStatus);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null })
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, searchTerm, statusFilter]);


  const fetchUsers = async () => {
    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm,
          status: statusFilter,
        },
      }
      const response = await axios.get(`${API_URL}/api/users`, config)
      setUsers(response.data.data)
      setPagination(response.data.pagination)
    } catch (error) {
      toast.error("Failed to fetch users")
      console.error("Fetch users error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!deleteModal.user) return

    setIsDeleting(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      await axios.delete(`${API_URL}/api/users/${deleteModal.user._id}`, config)
      toast.success("User deleted successfully")
      setDeleteModal({ isOpen: false, user: null })
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setPagination({ ...pagination, page: 1 })
  }

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value)
    setPagination({ ...pagination, page: 1 })
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
    }
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status] || "bg-gray-100 text-gray-800"}`}
      >
        {status}
      </span>
    )
  }

  const getRoleBadge = (role) => {
    const roleClasses = {
      admin: "bg-purple-100 text-purple-800",
      voter: "bg-blue-100 text-blue-800",
    }
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${roleClasses[role] || "bg-gray-100 text-gray-800"}`}
      >
        {role}
      </span>
    )
  }

  if (loading && users.length === 0) return <Spinner />

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-dark">Manage Users</h1>
          <p className="text-neutral mt-2">View and manage user accounts</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              className="form-input pl-10"
            />
          </div>
          <div className="relative">
            {/* <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
            <select value={statusFilter} onChange={handleStatusFilter} className="form-input pl-10">
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-center text-sm text-gray-600">Total: {pagination.total} users</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">ID: {user._id.slice(-8)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      {getStatusBadge(user.status)}
                      {user.isEmailVerified && <span className="text-xs text-green-600">✓ Email Verified</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(user.role)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/users/${user._id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <FaEye />
                      </Link>
                      <Link
                        to={`/admin/users/edit/${user._id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit User"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, user })}
                        className="text-red-600 hover:text-red-900"
                        title="Delete User"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.pages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span>{" "}
                  of <span className="font-medium">{pagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setPagination({ ...pagination, page })}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === pagination.page
                          ? "z-10 bg-primary border-primary text-white"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteModal.user?.firstName} ${deleteModal.user?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  )
}

export default ManageUsersPage
