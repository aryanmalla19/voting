"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext"
import { API_URL } from "../../config"
import { toast } from "react-toastify"
import {
  FaSave,
  FaTimes,
  FaPlus,
  FaTrash,
  FaUser,
  FaCalendarAlt,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
  FaGlobe,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaEdit,
  FaBriefcase,
  FaImage,
} from "react-icons/fa"
import Spinner from "../../components/layout/Spinner"

const EditElectionPage = () => {
  const { electionId } = useParams()
  const navigate = useNavigate()
  const { token } = useContext(AuthContext)

  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedPosition, setExpandedPosition] = useState(null)
  const [expandedCandidate, setExpandedCandidate] = useState({})

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "draft",
    positions: [],
  })

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchElection(), fetchUsers()])
    }
    fetchData()
  }, [electionId])

  const fetchElection = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const res = await axios.get(`${API_URL}/api/elections/${electionId}`, config)
      const election = res.data.data

      setFormData({
        title: election.title,
        description: election.description,
        startDate: new Date(election.startDate).toISOString().slice(0, 16),
        endDate: new Date(election.endDate).toISOString().slice(0, 16),
        status: election.status,
        positions:
          election.positions?.map((position) => ({
            ...position,
            candidates:
              position.candidates?.map((candidate) => ({
                ...candidate,
                campaignInfo: {
                  experience: candidate.campaignInfo?.experience || "",
                  education: candidate.campaignInfo?.education || "",
                  achievements: candidate.campaignInfo?.achievements || [],
                  promises: candidate.campaignInfo?.promises || [],
                  socialMedia: {
                    website: candidate.campaignInfo?.socialMedia?.website || "",
                    twitter: candidate.campaignInfo?.socialMedia?.twitter || "",
                    facebook: candidate.campaignInfo?.socialMedia?.facebook || "",
                    linkedin: candidate.campaignInfo?.socialMedia?.linkedin || "",
                  },
                },
              })) || [],
          })) || [],
      })
    } catch (error) {
      toast.error("Failed to fetch election details")
      console.error("Fetch election error:", error)
      navigate("/admin/elections")
    }
  }

  const fetchUsers = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const res = await axios.get(`${API_URL}/api/users`, config)
      setUsers(res.data.data || [])
    } catch (error) {
      toast.error("Failed to fetch users")
      console.error("Fetch users error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePositionChange = (positionIndex, field, value) => {
    const updatedPositions = [...formData.positions]
    updatedPositions[positionIndex][field] = value
    setFormData({ ...formData, positions: updatedPositions })
  }

  const handleCandidateChange = (positionIndex, candidateIndex, field, value) => {
    const updatedPositions = [...formData.positions]

    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      if (parent === "campaignInfo") {
        updatedPositions[positionIndex].candidates[candidateIndex].campaignInfo[child] = value
      }
    } else {
      updatedPositions[positionIndex].candidates[candidateIndex][field] = value

      // Auto-populate name when user is selected
      if (field === "userId" && value) {
        const selectedUser = users.find((user) => user._id === value)
        if (selectedUser) {
          updatedPositions[positionIndex].candidates[candidateIndex].name =
            `${selectedUser.firstName} ${selectedUser.lastName}`
          // Only generate new candidate ID if it doesn't exist
          if (!updatedPositions[positionIndex].candidates[candidateIndex].candidateId) {
            updatedPositions[positionIndex].candidates[candidateIndex].candidateId =
              `CAND_${Date.now()}_${Math.random().toString(36).substr(2, 5).toUpperCase()}`
          }
        }
      }
    }

    setFormData({ ...formData, positions: updatedPositions })
  }

  const handleSocialMediaChange = (positionIndex, candidateIndex, platform, value) => {
    const updatedPositions = [...formData.positions]
    updatedPositions[positionIndex].candidates[candidateIndex].campaignInfo.socialMedia[platform] = value
    setFormData({ ...formData, positions: updatedPositions })
  }

  const handleArrayChange = (positionIndex, candidateIndex, field, value) => {
    const updatedPositions = [...formData.positions]
    updatedPositions[positionIndex].candidates[candidateIndex].campaignInfo[field] = value
      .split("\n")
      .filter((item) => item.trim())
    setFormData({ ...formData, positions: updatedPositions })
  }

  const addPosition = () => {
    setFormData({
      ...formData,
      positions: [
        ...formData.positions,
        {
          positionId: `POS_${Date.now()}_${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
          title: "",
          description: "",
          candidates: [],
        },
      ],
    })
  }

  const removePosition = (positionIndex) => {
    if (formData.positions.length > 1) {
      const updatedPositions = formData.positions.filter((_, i) => i !== positionIndex)
      setFormData({ ...formData, positions: updatedPositions })
    }
  }

  const addCandidate = (positionIndex) => {
    const updatedPositions = [...formData.positions]
    updatedPositions[positionIndex].candidates.push({
      userId: "",
      candidateId: "",
      name: "",
      bio: "",
      symbol: "",
      agenda: "",
      photo: "",
      campaignInfo: {
        experience: "",
        education: "",
        achievements: [],
        promises: [],
        socialMedia: {
          website: "",
          twitter: "",
          facebook: "",
          linkedin: "",
        },
      },
    })
    setFormData({ ...formData, positions: updatedPositions })
  }

  const removeCandidate = (positionIndex, candidateIndex) => {
    const updatedPositions = [...formData.positions]
    if (updatedPositions[positionIndex].candidates.length > 1) {
      updatedPositions[positionIndex].candidates = updatedPositions[positionIndex].candidates.filter(
        (_, i) => i !== candidateIndex,
      )
      setFormData({ ...formData, positions: updatedPositions })
    }
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Election title is required")
      return false
    }

    if (!formData.description.trim()) {
      toast.error("Election description is required")
      return false
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error("Start and end dates are required")
      return false
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error("End date must be after start date")
      return false
    }

    if (formData.positions.length === 0) {
      toast.error("At least one position is required")
      return false
    }

    for (let i = 0; i < formData.positions.length; i++) {
      const position = formData.positions[i]

      if (!position.title.trim()) {
        toast.error(`Position title is required for position ${i + 1}`)
        return false
      }

      if (!position.description.trim()) {
        toast.error(`Position description is required for position ${i + 1}`)
        return false
      }

      if (position.candidates.length === 0) {
        toast.error(`At least one candidate is required for position: ${position.title}`)
        return false
      }

      for (let j = 0; j < position.candidates.length; j++) {
        const candidate = position.candidates[j]

        if (!candidate.userId) {
          toast.error(`Please select a user for candidate ${j + 1} in position: ${position.title}`)
          return false
        }

        if (!candidate.name.trim()) {
          toast.error(`Name is required for candidate ${j + 1} in position: ${position.title}`)
          return false
        }

        if (!candidate.bio.trim() || candidate.bio.length < 50) {
          toast.error(`Bio must be at least 50 characters for candidate ${j + 1} in position: ${position.title}`)
          return false
        }

        if (!candidate.symbol.trim()) {
          toast.error(`Symbol is required for candidate ${j + 1} in position: ${position.title}`)
          return false
        }

        if (!candidate.agenda.trim() || candidate.agenda.length < 100) {
          toast.error(`Agenda must be at least 100 characters for candidate ${j + 1} in position: ${position.title}`)
          return false
        }
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } }
      await axios.put(`${API_URL}/api/elections/${electionId}`, formData, config)
      toast.success("Election updated successfully!")
      navigate("/admin/elections")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update election")
      console.error("Update election error:", error)
    }
    setIsSubmitting(false)
  }

  const toggleCandidateExpansion = (positionIndex, candidateIndex) => {
    const key = `${positionIndex}-${candidateIndex}`
    setExpandedCandidate((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  if (isLoading) return <Spinner />

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white flex items-center">
              <FaEdit className="mr-3" />
              Edit Election
            </h1>
            <p className="text-green-100 mt-2">Update election details, positions, and candidate information</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Election Details */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaInfoCircle className="mr-2 text-blue-500" />
                Election Details
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="form-label">
                    Election Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className="form-input"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Student Council Election 2024"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="status" className="form-label">
                    Status
                  </label>
                  <select
                    name="status"
                    id="status"
                    className="form-input"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="description" className="form-label">
                  Description *
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows="3"
                  className="form-input"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the purpose and scope of this election..."
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label htmlFor="startDate" className="form-label flex items-center">
                    <FaCalendarAlt className="mr-2 text-green-500" />
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    id="startDate"
                    className="form-input"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="form-label flex items-center">
                    <FaCalendarAlt className="mr-2 text-red-500" />
                    End Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    id="endDate"
                    className="form-input"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Positions Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <FaBriefcase className="mr-2 text-purple-500" />
                  Positions ({formData.positions.length})
                </h2>
                <button type="button" onClick={addPosition} className="btn btn-primary flex items-center text-sm">
                  <FaPlus className="mr-2" />
                  Add Position
                </button>
              </div>

              {formData.positions.map((position, positionIndex) => (
                <div key={positionIndex} className="bg-white rounded-lg border border-gray-200 mb-6 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-100 to-blue-100 px-6 py-4 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">
                      Position {positionIndex + 1}: {position.title || "Unnamed Position"}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setExpandedPosition(expandedPosition === positionIndex ? null : positionIndex)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        {expandedPosition === positionIndex ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                      {formData.positions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePosition(positionIndex)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Position Details */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">Position Title *</label>
                        <input
                          type="text"
                          className="form-input"
                          value={position.title}
                          onChange={(e) => handlePositionChange(positionIndex, "title", e.target.value)}
                          placeholder="e.g., President, Vice President"
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label">Position Description *</label>
                        <input
                          type="text"
                          className="form-input"
                          value={position.description}
                          onChange={(e) => handlePositionChange(positionIndex, "description", e.target.value)}
                          placeholder="Brief description of the position"
                          required
                        />
                      </div>
                    </div>

                    {/* Candidates for this Position */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-gray-700 flex items-center">
                          <FaUser className="mr-2 text-green-500" />
                          Candidates ({position.candidates.length})
                        </h4>
                        <button
                          type="button"
                          onClick={() => addCandidate(positionIndex)}
                          className="btn btn-secondary flex items-center text-sm"
                        >
                          <FaPlus className="mr-2" />
                          Add Candidate
                        </button>
                      </div>

                      {position.candidates.map((candidate, candidateIndex) => {
                        const candidateKey = `${positionIndex}-${candidateIndex}`
                        const isExpanded = expandedCandidate[candidateKey]

                        return (
                          <div
                            key={candidateIndex}
                            className="bg-gray-50 rounded-lg border border-gray-300 mb-4 overflow-hidden"
                          >
                            <div className="bg-gray-200 px-4 py-3 flex justify-between items-center">
                              <h5 className="font-medium text-gray-800">
                                Candidate {candidateIndex + 1}: {candidate.name || "Unnamed"}
                              </h5>
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => toggleCandidateExpansion(positionIndex, candidateIndex)}
                                  className="text-gray-600 hover:text-gray-800"
                                >
                                  {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                </button>
                                {position.candidates.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeCandidate(positionIndex, candidateIndex)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <FaTrash />
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="p-4 space-y-4">
                              {/* Basic Candidate Information */}
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <label className="form-label">Select User *</label>
                                  <select
                                    className="form-input"
                                    value={candidate.userId}
                                    onChange={(e) =>
                                      handleCandidateChange(positionIndex, candidateIndex, "userId", e.target.value)
                                    }
                                    required
                                  >
                                    <option value="">Choose a registered user...</option>
                                    {users.map((user) => (
                                      <option key={user._id} value={user._id}>
                                        {user.firstName} {user.lastName} ({user.email})
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="form-label">Candidate Name *</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    value={candidate.name}
                                    onChange={(e) =>
                                      handleCandidateChange(positionIndex, candidateIndex, "name", e.target.value)
                                    }
                                    placeholder="Candidate full name"
                                    required
                                  />
                                </div>
                              </div>

                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <label className="form-label">Symbol *</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    value={candidate.symbol}
                                    onChange={(e) =>
                                      handleCandidateChange(positionIndex, candidateIndex, "symbol", e.target.value)
                                    }
                                    placeholder="e.g., 🌟, 🚀, 🎯"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="form-label flex items-center">
                                    <FaImage className="mr-2 text-blue-500" />
                                    Photo URL
                                  </label>
                                  <input
                                    type="url"
                                    className="form-input"
                                    value={candidate.photo}
                                    onChange={(e) =>
                                      handleCandidateChange(positionIndex, candidateIndex, "photo", e.target.value)
                                    }
                                    placeholder="https://example.com/photo.jpg"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="form-label">
                                  Bio * (minimum 50 characters) - {candidate.bio.length}/50
                                </label>
                                <textarea
                                  rows="3"
                                  className="form-input"
                                  value={candidate.bio}
                                  onChange={(e) =>
                                    handleCandidateChange(positionIndex, candidateIndex, "bio", e.target.value)
                                  }
                                  placeholder="Brief biography of the candidate..."
                                  required
                                />
                              </div>

                              <div>
                                <label className="form-label">
                                  Agenda * (minimum 100 characters) - {candidate.agenda.length}/100
                                </label>
                                <textarea
                                  rows="4"
                                  className="form-input"
                                  value={candidate.agenda}
                                  onChange={(e) =>
                                    handleCandidateChange(positionIndex, candidateIndex, "agenda", e.target.value)
                                  }
                                  placeholder="Candidate's agenda and key points..."
                                  required
                                />
                              </div>

                              {/* Campaign Information (Collapsible) */}
                              {isExpanded && (
                                <div className="border-t pt-4 mt-4">
                                  <h6 className="font-semibold text-gray-700 mb-4">Campaign Information (Optional)</h6>

                                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                      <label className="form-label">Experience</label>
                                      <textarea
                                        rows="3"
                                        className="form-input"
                                        value={candidate.campaignInfo.experience}
                                        onChange={(e) =>
                                          handleCandidateChange(
                                            positionIndex,
                                            candidateIndex,
                                            "campaignInfo.experience",
                                            e.target.value,
                                          )
                                        }
                                        placeholder="Previous experience and qualifications..."
                                      />
                                    </div>
                                    <div>
                                      <label className="form-label">Education</label>
                                      <textarea
                                        rows="3"
                                        className="form-input"
                                        value={candidate.campaignInfo.education}
                                        onChange={(e) =>
                                          handleCandidateChange(
                                            positionIndex,
                                            candidateIndex,
                                            "campaignInfo.education",
                                            e.target.value,
                                          )
                                        }
                                        placeholder="Educational background..."
                                      />
                                    </div>
                                  </div>

                                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                      <label className="form-label">Achievements (one per line)</label>
                                      <textarea
                                        rows="3"
                                        className="form-input"
                                        value={candidate.campaignInfo.achievements.join("\n")}
                                        onChange={(e) =>
                                          handleArrayChange(
                                            positionIndex,
                                            candidateIndex,
                                            "achievements",
                                            e.target.value,
                                          )
                                        }
                                        placeholder="Key achievements and awards..."
                                      />
                                    </div>
                                    <div>
                                      <label className="form-label">Campaign Promises (one per line)</label>
                                      <textarea
                                        rows="3"
                                        className="form-input"
                                        value={candidate.campaignInfo.promises.join("\n")}
                                        onChange={(e) =>
                                          handleArrayChange(positionIndex, candidateIndex, "promises", e.target.value)
                                        }
                                        placeholder="Campaign promises and commitments..."
                                      />
                                    </div>
                                  </div>

                                  {/* Social Media Links */}
                                  <div className="bg-white rounded-lg p-4 border">
                                    <h6 className="font-medium text-gray-700 mb-3">Social Media Links</h6>
                                    <div className="grid md:grid-cols-2 gap-4">
                                      <div>
                                        <label className="form-label flex items-center">
                                          <FaGlobe className="mr-2 text-blue-500" />
                                          Website
                                        </label>
                                        <input
                                          type="url"
                                          className="form-input"
                                          value={candidate.campaignInfo.socialMedia.website}
                                          onChange={(e) =>
                                            handleSocialMediaChange(
                                              positionIndex,
                                              candidateIndex,
                                              "website",
                                              e.target.value,
                                            )
                                          }
                                          placeholder="https://candidate-website.com"
                                        />
                                      </div>
                                      <div>
                                        <label className="form-label flex items-center">
                                          <FaTwitter className="mr-2 text-blue-400" />
                                          Twitter
                                        </label>
                                        <input
                                          type="url"
                                          className="form-input"
                                          value={candidate.campaignInfo.socialMedia.twitter}
                                          onChange={(e) =>
                                            handleSocialMediaChange(
                                              positionIndex,
                                              candidateIndex,
                                              "twitter",
                                              e.target.value,
                                            )
                                          }
                                          placeholder="https://twitter.com/username"
                                        />
                                      </div>
                                      <div>
                                        <label className="form-label flex items-center">
                                          <FaFacebook className="mr-2 text-blue-600" />
                                          Facebook
                                        </label>
                                        <input
                                          type="url"
                                          className="form-input"
                                          value={candidate.campaignInfo.socialMedia.facebook}
                                          onChange={(e) =>
                                            handleSocialMediaChange(
                                              positionIndex,
                                              candidateIndex,
                                              "facebook",
                                              e.target.value,
                                            )
                                          }
                                          placeholder="https://facebook.com/username"
                                        />
                                      </div>
                                      <div>
                                        <label className="form-label flex items-center">
                                          <FaLinkedin className="mr-2 text-blue-700" />
                                          LinkedIn
                                        </label>
                                        <input
                                          type="url"
                                          className="form-input"
                                          value={candidate.campaignInfo.socialMedia.linkedin}
                                          onChange={(e) =>
                                            handleSocialMediaChange(
                                              positionIndex,
                                              candidateIndex,
                                              "linkedin",
                                              e.target.value,
                                            )
                                          }
                                          placeholder="https://linkedin.com/in/username"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate("/admin/elections")}
                className="btn btn-neutral flex items-center"
                disabled={isSubmitting}
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>
              <button type="submit" className="btn btn-primary flex items-center" disabled={isSubmitting}>
                <FaSave className="mr-2" />
                {isSubmitting ? "Updating..." : "Update Election"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditElectionPage
