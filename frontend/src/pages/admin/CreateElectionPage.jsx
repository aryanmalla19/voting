"use client"

import { useState, useContext } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { API_URL } from "../../config"
import { toast } from "react-toastify"
import { FaPlus, FaTrashAlt, FaCalendarAlt } from "react-icons/fa"

const CreateElectionPage = () => {
  const { token } = useContext(AuthContext)
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [candidates, setCandidates] = useState([{ name: "", description: "", position: "" }])
  const [isLoading, setIsLoading] = useState(false)

  const handleCandidateChange = (index, field, value) => {
    const newCandidates = [...candidates]
    newCandidates[index][field] = value
    setCandidates(newCandidates)
  }

  const addCandidateField = () => {
    setCandidates([...candidates, { name: "", description: "", position: "" }])
  }

  const removeCandidateField = (index) => {
    const newCandidates = candidates.filter((_, i) => i !== index)
    setCandidates(newCandidates)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (new Date(startDate) >= new Date(endDate)) {
      toast.error("End date must be after start date.")
      setIsLoading(false)
      return
    }
    if (candidates.some((c) => !c.name.trim())) {
      toast.error("All candidate names are required.")
      setIsLoading(false)
      return
    }

    try {
      const electionData = {
        title,
        description,
        startDate,
        endDate,
        candidates: candidates.filter((c) => c.name.trim() !== ""), // Filter out empty candidate names
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
      await axios.post(`${API_URL}/api/elections`, electionData, config)
      toast.success("Election created successfully!")
      navigate("/admin/elections")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create election.")
      console.error("Create election error:", error)
    }
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-neutral-dark mb-8">Create New Election</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg p-8 space-y-6">
        <div>
          <label htmlFor="title" className="form-label">
            Election Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            required
            placeholder="e.g., Student Council Election 2025"
          />
        </div>

        <div>
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-input"
            rows="4"
            required
            placeholder="Detailed description of the election..."
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="startDate" className="form-label">
              Start Date & Time
            </label>
            <div className="relative">
              <input
                id="startDate"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-input pl-10"
                required
              />
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <label htmlFor="endDate" className="form-label">
              End Date & Time
            </label>
            <div className="relative">
              <input
                id="endDate"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="form-input pl-10"
                required
              />
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Candidates</h3>
          {candidates.map((candidate, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-md mb-4 space-y-3 bg-gray-50">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-600">Candidate {index + 1}</p>
                {candidates.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCandidateField(index)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove Candidate"
                  >
                    <FaTrashAlt />
                  </button>
                )}
              </div>
              <div>
                <label htmlFor={`candidateName-${index}`} className="text-sm font-medium text-gray-600">
                  Name
                </label>
                <input
                  id={`candidateName-${index}`}
                  type="text"
                  value={candidate.name}
                  onChange={(e) => handleCandidateChange(index, "name", e.target.value)}
                  className="form-input mt-1"
                  placeholder="Candidate Full Name"
                  required
                />
              </div>
              <div>
                <label htmlFor={`candidatePosition-${index}`} className="text-sm font-medium text-gray-600">
                  Position (Optional)
                </label>
                <input
                  id={`candidatePosition-${index}`}
                  type="text"
                  value={candidate.position}
                  onChange={(e) => handleCandidateChange(index, "position", e.target.value)}
                  className="form-input mt-1"
                  placeholder="e.g., President, Board Member"
                />
              </div>
              <div>
                <label htmlFor={`candidateDescription-${index}`} className="text-sm font-medium text-gray-600">
                  Short Bio/Description (Optional)
                </label>
                <textarea
                  id={`candidateDescription-${index}`}
                  value={candidate.description}
                  onChange={(e) => handleCandidateChange(index, "description", e.target.value)}
                  className="form-input mt-1"
                  rows="2"
                  placeholder="Brief information about the candidate..."
                ></textarea>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addCandidateField}
            className="btn btn-outline-primary mt-2 flex items-center text-sm"
          >
            <FaPlus className="mr-2" /> Add Candidate
          </button>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={() => navigate("/admin/elections")}
            className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 mr-4"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Election"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateElectionPage
