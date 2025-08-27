"use client"

import { useState, useEffect, useContext } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { API_URL } from "../../config"
import { toast } from "react-toastify"
import { FaEdit, FaTrashAlt, FaPlusCircle, FaEye, FaSearch, FaPoll } from "react-icons/fa"
import Spinner from "../../components/layout/Spinner"
import ConfirmationModal from "../../components/common/ConfirmationModal"

const ManageElectionsPage = () => {
  const queryParams = new URLSearchParams(location.search);
  const defaultStatus = queryParams.get("status") || "";
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  const { token } = useContext(AuthContext)
  const [elections, setElections] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("") // ✅ debounced value
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [electionToDelete, setElectionToDelete] = useState(null)
  const [statusFilter, setStatusFilter] = useState(defaultStatus)

  // ✅ debounce effect for search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500) // wait 500ms

    return () => clearTimeout(handler)
  }, [searchTerm])

  // ✅ fetch elections when token, debounced search, status, or pagination changes
  useEffect(() => {
    const fetchElections = async () => {
      setIsLoading(true)
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page: pagination.page,
            limit: pagination.limit,
            search: debouncedSearchTerm, // use debounced value
            status: statusFilter,
          },
        }
        const res = await axios.get(`${API_URL}/api/elections`, config)
        setElections(res.data.data)
        setPagination(res.data.pagination)
      } catch (error) {
        toast.error("Failed to fetch elections.")
        console.error("Fetch elections error:", error)
      }
      setIsLoading(false)
    }

    if (token) {
      fetchElections()
    } else {
      setIsLoading(false)
      toast.error("Authentication token not found. Please log in.")
    }
  }, [token, debouncedSearchTerm, statusFilter, pagination.page, pagination.limit])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setPagination({ ...pagination, page: 1 })
  }

  const getStatusBadge = (status) => {
    const baseClasses = "text-xs font-semibold px-2.5 py-0.5 rounded-full"
    if (status === "active") return <span className={`${baseClasses} bg-green-100 text-green-800`}>Active</span>
    if (status === "upcoming") return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Upcoming</span>
    if (status === "completed") return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Completed</span>
    if (status === "cancelled") return <span className={`${baseClasses} bg-red-100 text-red-800`}>Cancelled</span>
    return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>{status || "Unknown"}</span>
  }

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString()

  const openDeleteModal = (election) => {
    setElectionToDelete(election)
    setShowDeleteModal(true)
    console.log("MEOWWW");
  }

  const closeDeleteModal = () => {
    setElectionToDelete(null)
    setShowDeleteModal(false)
  }

  const confirmDeleteElection = async () => {
    if (!electionToDelete) return
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } }
      await axios.delete(`${API_URL}/api/elections/${electionToDelete._id}`, config)
      setElections(elections.filter((e) => e._id !== electionToDelete._id))
      toast.success(`Election "${electionToDelete.title}" deleted successfully.`)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete election.")
      console.error("Delete election error:", error)
    }
    closeDeleteModal()
  }

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value)
    setPagination({ ...pagination, page: 1 })
  }

  if (isLoading) return <Spinner />

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-dark mb-4 sm:mb-0">Manage Elections</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search elections..."
              className="form-input pl-10 w-full sm:w-64"
              onChange={handleSearch}
              value={searchTerm}
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative w-[200px]">
            <select value={statusFilter} onChange={handleStatusFilter} className="form-input">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <Link to="/admin/elections/create" className="btn btn-primary flex items-center">
            <FaPlusCircle className="mr-2" /> Create Election
          </Link>
        </div>
      </div>

      {elections.length === 0 && !isLoading ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <FaPoll className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No Elections Found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {debouncedSearchTerm ? "No elections match your search criteria." : "There are no elections in the system yet."}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {elections.map((election) => (
                <tr key={election._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{election.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(election.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(election.startDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(election.endDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {election.candidates?.length || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      to={`/results/${election._id}`}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Results"
                    >
                      <FaEye className="inline h-5 w-5" />
                    </Link>
                    <Link
                      to={`/admin/elections/edit/${election._id}`}
                      className="text-primary hover:text-primary-hover"
                      title="Edit Election"
                    >
                      <FaEdit className="inline h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => openDeleteModal(election)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Election"
                      // disabled={election.status === "active" || election.status === "completed"}
                    >
                      <FaTrashAlt className="inline h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteElection}
        title="Delete Election"
        message={`Are you sure you want to delete the election "${electionToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  )
}

export default ManageElectionsPage
