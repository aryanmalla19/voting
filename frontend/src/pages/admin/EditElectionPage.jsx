"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext"
import { API_URL } from "../../config"
import { toast } from "react-toastify"
import Spinner from "../../components/layout/Spinner"
import { FaSave, FaTimes, FaPlus, FaTrash } from "react-icons/fa"

const EditElectionPage = () => {
  const { electionId } = useParams()
  const navigate = useNavigate()
  const { token } = useContext(AuthContext)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    candidates: [{ name: "", position: "" }],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchElection = async () => {
      setIsLoading(true)
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } }
        const res = await axios.get(`${API_URL}/api/elections/${electionId}`, config)
        const electionData = res.data.data
        setFormData({
          title: electionData.title,
          description: electionData.description,
          startDate: electionData.startDate.split("T")[0], // Format for date input
          endDate: electionData.endDate.split("T")[0], // Format for date input
          candidates: electionData.candidates.map((c) => ({ name: c.name, position: c.position, _id: c._id })), // Keep _id if present
        })
      } catch (error) {
        toast.error("Failed to fetch election details.")
        console.error("Fetch election error:", error)
        navigate("/admin/elections")
      }
      setIsLoading(false)
    }
    if (token && electionId) {
      fetchElection()
    }
  }, [electionId, token, navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCandidateChange = (index, e) => {
    const newCandidates = formData.candidates.map((candidate, i) => {
      if (index === i) {
        return { ...candidate, [e.target.name]: e.target.value }
      }
      return candidate
    })
    setFormData({ ...formData, candidates: newCandidates })
  }

  const addCandidate = () => {
    setFormData({
      ...formData,
      candidates: [...formData.candidates, { name: "", position: "" }],
    })
  }

  const removeCandidate = (index) => {
    const newCandidates = formData.candidates.filter((_, i) => i !== index)
    setFormData({ ...formData, candidates: newCandidates })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } }
      // Filter out candidates with empty names before submitting
      const payload = {
        ...formData,
        candidates: formData.candidates.filter((c) => c.name.trim() !== ""),
      }
      await axios.put(`${API_URL}/api/elections/${electionId}`, payload, config)
      toast.success("Election updated successfully!")
      navigate("/admin/elections")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update election.")
      console.error("Update election error:", error)
    }
    setIsSubmitting(false)
  }

  if (isLoading) return <Spinner />

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-neutral-dark mb-6">Edit Election</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="form-label">
              Election Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows="3"
              className="form-input"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startDate" className="form-label">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                id="startDate"
                className="form-input"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="endDate" className="form-label">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                id="endDate"
                className="form-input"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <fieldset className="border border-gray-300 p-4 rounded-md">
            <legend className="text-lg font-medium text-neutral-dark px-2">Candidates</legend>
            {formData.candidates.map((candidate, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
                <div className="md:col-span-1">
                  <label htmlFor={`candidateName-${index}`} className="form-label text-sm">
                    Candidate Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id={`candidateName-${index}`}
                    className="form-input form-input-sm"
                    value={candidate.name}
                    onChange={(e) => handleCandidateChange(index, e)}
                    placeholder="Full Name"
                  />
                </div>
                <div className="md:col-span-1">
                  <label htmlFor={`candidatePosition-${index}`} className="form-label text-sm">
                    Position (Optional)
                  </label>
                  <input
                    type="text"
                    name="position"
                    id={`candidatePosition-${index}`}
                    className="form-input form-input-sm"
                    value={candidate.position}
                    onChange={(e) => handleCandidateChange(index, e)}
                    placeholder="e.g., President"
                  />
                </div>
                <div className="md:col-span-1">
                  {formData.candidates.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCandidate(index)}
                      className="btn btn-danger-outline btn-sm w-full md:w-auto flex items-center justify-center"
                      title="Remove Candidate"
                    >
                      <FaTrash className="mr-1 md:mr-2" /> Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button type="button" onClick={addCandidate} className="btn btn-secondary-outline btn-sm flex items-center">
              <FaPlus className="mr-2" /> Add Candidate
            </button>
          </fieldset>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/admin/elections")}
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

export default EditElectionPage
