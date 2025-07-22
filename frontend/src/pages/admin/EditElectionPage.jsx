"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext"
import { API_URL } from "../../config"
import { toast } from "react-toastify"
import Spinner from "../../components/layout/Spinner"
import { FaSave, FaTimes, FaPlus, FaTrash, FaUser, FaIdCard, FaFlag, FaFileAlt, FaBullhorn } from "react-icons/fa"

const EditElectionPage = () => {
  const { electionId } = useParams()
  const navigate = useNavigate()
  const { token } = useContext(AuthContext)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    candidates: [
      {
        userId: "",
        candidateId: "",
        name: "",
        position: "",
        bio: "",
        symbol: "",
        agenda: "",
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
      },
    ],
  })
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } }

        // Fetch election data and users in parallel
        const [electionRes, usersRes] = await Promise.all([
          axios.get(`${API_URL}/api/elections/${electionId}`, config),
          axios.get(`${API_URL}/api/users`, config),
        ])

        const electionData = electionRes.data.data
        setUsers(usersRes.data.data || [])

        // Format dates for datetime-local input
        const formatDateTime = (dateString) => {
          const date = new Date(dateString)
          return date.toISOString().slice(0, 16)
        }

        setFormData({
          title: electionData.title,
          description: electionData.description,
          startDate: formatDateTime(electionData.startDate),
          endDate: formatDateTime(electionData.endDate),
          candidates: electionData.candidates.map((c) => ({
            _id: c._id,
            userId: c.userId || "",
            candidateId: c.candidateId || "",
            name: c.name || "",
            position: c.position || "",
            bio: c.bio || "",
            symbol: c.symbol || "",
            agenda: c.agenda || "",
            campaignInfo: {
              experience: c.campaignInfo?.experience || "",
              education: c.campaignInfo?.education || "",
              achievements: c.campaignInfo?.achievements || [],
              promises: c.campaignInfo?.promises || [],
              socialMedia: {
                website: c.campaignInfo?.socialMedia?.website || "",
                twitter: c.campaignInfo?.socialMedia?.twitter || "",
                facebook: c.campaignInfo?.socialMedia?.facebook || "",
                linkedin: c.campaignInfo?.socialMedia?.linkedin || "",
              },
            },
          })),
        })
      } catch (error) {
        toast.error("Failed to fetch election details.")
        console.error("Fetch election error:", error)
        navigate("/admin/elections")
      }
      setIsLoading(false)
    }

    if (token && electionId) {
      fetchData()
    }
  }, [electionId, token, navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCandidateChange = (index, field, value) => {
    const newCandidates = [...formData.candidates]

    if (field.includes(".")) {
      // Handle nested fields
      const [parent, child] = field.split(".")
      if (parent === "socialMedia") {
        newCandidates[index].campaignInfo.socialMedia[child] = value
      } else {
        newCandidates[index].campaignInfo[child] = value
      }
    } else if (field === "achievements" || field === "promises") {
      // Handle array fields
      newCandidates[index].campaignInfo[field] = value.split("\n").filter((item) => item.trim())
    } else {
      newCandidates[index][field] = value

      // Auto-update name when user is selected
      if (field === "userId" && value) {
        const selectedUser = users.find((user) => user._id === value)
        if (selectedUser) {
          newCandidates[index].name = `${selectedUser.firstName} ${selectedUser.lastName}`
          // Only generate new candidateId if it doesn't exist
          if (!newCandidates[index].candidateId) {
            newCandidates[index].candidateId =
              `CAND_${Date.now()}_${Math.random().toString(36).substr(2, 5).toUpperCase()}`
          }
        }
      }
    }

    setFormData({ ...formData, candidates: newCandidates })
  }

  const addCandidate = () => {
    setFormData({
      ...formData,
      candidates: [
        ...formData.candidates,
        {
          userId: "",
          candidateId: "",
          name: "",
          position: "",
          bio: "",
          symbol: "",
          agenda: "",
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
        },
      ],
    })
  }

  const removeCandidate = (index) => {
    const newCandidates = formData.candidates.filter((_, i) => i !== index)
    setFormData({ ...formData, candidates: newCandidates })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validation
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error("End date must be after start date.")
      setIsSubmitting(false)
      return
    }

    // Validate candidates
    for (let i = 0; i < formData.candidates.length; i++) {
      const candidate = formData.candidates[i]
      if (!candidate.userId) {
        toast.error(`Please select a user for candidate ${i + 1}`)
        setIsSubmitting(false)
        return
      }
      if (!candidate.name.trim()) {
        toast.error(`Candidate ${i + 1} name is required`)
        setIsSubmitting(false)
        return
      }
      if (!candidate.position.trim()) {
        toast.error(`Position is required for candidate ${i + 1}`)
        setIsSubmitting(false)
        return
      }
      if (!candidate.bio.trim() || candidate.bio.length < 50) {
        toast.error(`Bio must be at least 50 characters for candidate ${i + 1}`)
        setIsSubmitting(false)
        return
      }
      if (!candidate.symbol.trim()) {
        toast.error(`Symbol is required for candidate ${i + 1}`)
        setIsSubmitting(false)
        return
      }
      if (!candidate.agenda.trim() || candidate.agenda.length < 100) {
        toast.error(`Agenda must be at least 100 characters for candidate ${i + 1}`)
        setIsSubmitting(false)
        return
      }
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const payload = {
        ...formData,
        candidates: formData.candidates.filter((c) => c.userId && c.name.trim()),
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
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-neutral-dark mb-6">Edit Election</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Election Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Election Details</h2>

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
                  Start Date & Time
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
                <label htmlFor="endDate" className="form-label">
                  End Date & Time
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

          {/* Candidates Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Candidates</h2>
              <button
                type="button"
                onClick={addCandidate}
                className="btn btn-secondary-outline btn-sm flex items-center"
              >
                <FaPlus className="mr-2" /> Add Candidate
              </button>
            </div>

            {formData.candidates.map((candidate, index) => (
              <div key={index} className="p-6 border-2 border-gray-200 rounded-lg bg-gray-50 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                    <FaUser className="mr-2" />
                    Candidate {index + 1}
                  </h3>
                  {formData.candidates.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCandidate(index)}
                      className="text-red-500 hover:text-red-700 p-2"
                      title="Remove Candidate"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>

                {/* Basic Candidate Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label flex items-center">
                      <FaUser className="mr-2" />
                      Select User *
                    </label>
                    <select
                      value={candidate.userId}
                      onChange={(e) => handleCandidateChange(index, "userId", e.target.value)}
                      className="form-input"
                      required
                    >
                      <option value="">Select a registered user</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.firstName} {user.lastName} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label flex items-center">
                      <FaIdCard className="mr-2" />
                      Candidate ID
                    </label>
                    <input
                      type="text"
                      value={candidate.candidateId}
                      onChange={(e) => handleCandidateChange(index, "candidateId", e.target.value)}
                      className="form-input bg-gray-100"
                      placeholder="Auto-generated"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      value={candidate.name}
                      onChange={(e) => handleCandidateChange(index, "name", e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Position *</label>
                    <input
                      type="text"
                      value={candidate.position}
                      onChange={(e) => handleCandidateChange(index, "position", e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label flex items-center">
                      <FaFlag className="mr-2" />
                      Symbol *
                    </label>
                    <input
                      type="text"
                      value={candidate.symbol}
                      onChange={(e) => handleCandidateChange(index, "symbol", e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                {/* Bio and Agenda */}
                <div className="space-y-4">
                  <div>
                    <label className="form-label flex items-center">
                      <FaFileAlt className="mr-2" />
                      Bio * (minimum 50 characters)
                    </label>
                    <textarea
                      value={candidate.bio}
                      onChange={(e) => handleCandidateChange(index, "bio", e.target.value)}
                      className="form-input"
                      rows="3"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">{candidate.bio.length}/50 characters minimum</p>
                  </div>

                  <div>
                    <label className="form-label flex items-center">
                      <FaBullhorn className="mr-2" />
                      Campaign Agenda * (minimum 100 characters)
                    </label>
                    <textarea
                      value={candidate.agenda}
                      onChange={(e) => handleCandidateChange(index, "agenda", e.target.value)}
                      className="form-input"
                      rows="4"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">{candidate.agenda.length}/100 characters minimum</p>
                  </div>
                </div>

                {/* Campaign Info (Optional) */}
                <details className="bg-white p-4 rounded border">
                  <summary className="cursor-pointer font-medium text-gray-700 mb-4">
                    Additional Campaign Information (Optional)
                  </summary>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Experience</label>
                      <textarea
                        value={candidate.campaignInfo.experience}
                        onChange={(e) => handleCandidateChange(index, "experience", e.target.value)}
                        className="form-input"
                        rows="3"
                      />
                    </div>

                    <div>
                      <label className="form-label">Education</label>
                      <textarea
                        value={candidate.campaignInfo.education}
                        onChange={(e) => handleCandidateChange(index, "education", e.target.value)}
                        className="form-input"
                        rows="3"
                      />
                    </div>

                    <div>
                      <label className="form-label">Achievements (one per line)</label>
                      <textarea
                        value={candidate.campaignInfo.achievements.join("\n")}
                        onChange={(e) => handleCandidateChange(index, "achievements", e.target.value)}
                        className="form-input"
                        rows="3"
                      />
                    </div>

                    <div>
                      <label className="form-label">Campaign Promises (one per line)</label>
                      <textarea
                        value={candidate.campaignInfo.promises.join("\n")}
                        onChange={(e) => handleCandidateChange(index, "promises", e.target.value)}
                        className="form-input"
                        rows="3"
                      />
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-3">Social Media Links</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">Website</label>
                        <input
                          type="url"
                          value={candidate.campaignInfo.socialMedia.website}
                          onChange={(e) => handleCandidateChange(index, "socialMedia.website", e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="form-label">Twitter</label>
                        <input
                          type="url"
                          value={candidate.campaignInfo.socialMedia.twitter}
                          onChange={(e) => handleCandidateChange(index, "socialMedia.twitter", e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="form-label">Facebook</label>
                        <input
                          type="url"
                          value={candidate.campaignInfo.socialMedia.facebook}
                          onChange={(e) => handleCandidateChange(index, "socialMedia.facebook", e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="form-label">LinkedIn</label>
                        <input
                          type="url"
                          value={candidate.campaignInfo.socialMedia.linkedin}
                          onChange={(e) => handleCandidateChange(index, "socialMedia.linkedin", e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
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
