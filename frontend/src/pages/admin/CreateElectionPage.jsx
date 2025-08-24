"use client"

import { useState, useContext, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { API_URL } from "../../config"
import { toast } from "react-toastify"
import { FaPlus, FaTimes, FaTrashAlt, FaUser, FaIdCard, FaFlag, FaFileAlt, FaBullhorn, FaCamera, FaImage } from "react-icons/fa"

const CreateElectionPage = () => {
  const { token } = useContext(AuthContext)
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [candidates, setCandidates] = useState([
    {
      userId: "",
      candidateId: "",
      name: "",
      position: "",
      bio: "",
      symbol: "",
      agenda: "",
      photo: null,
      photoPreview: null,
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
  ])
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(true)

  // Fetch users for candidate selection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        }
        const res = await axios.get(`${API_URL}/api/users`, config)
        setUsers(res.data.data || [])
      } catch (error) {
        console.error("Error fetching users:", error)
        toast.error("Failed to load users")
      }
      setLoadingUsers(false)
    }

    if (token) {
      fetchUsers()
    }
  }, [token])


  const handlePhotoChange = (index, file) => {
    if (file && file.type.startsWith("image/")) {
      console.log(file);
      const updatedCandidates = [...candidates]
      updatedCandidates[index].photo = file

      // Create preview URL
      const reader = new FileReader()
      console.log(reader);
      reader.onload = (e) => {
        updatedCandidates[index].photoPreview = e.target.result
        setCandidates(updatedCandidates)
      }
      reader.readAsDataURL(file)
    } else {
      toast.error("Please select a valid image file")
    }
  }

  const removePhoto = (index) => {
    const updatedCandidates = [...candidates]
    updatedCandidates[index].photo = null
    updatedCandidates[index].photoPreview = null
    setCandidates(updatedCandidates)
  }

  const handleCandidateChange = (index, field, value) => {
    const newCandidates = [...candidates]
    if (field.includes(".")) {
      // Handle nested fields like campaignInfo.experience
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

      // Auto-generate candidateId when user is selected
      if (field === "userId" && value) {
        const selectedUser = users.find((user) => user._id === value)
        if (selectedUser) {
          newCandidates[index].name = `${selectedUser.firstName} ${selectedUser.lastName}`
          newCandidates[index].candidateId =
            `CAND_${Date.now()}_${Math.random().toString(36).substr(2, 5).toUpperCase()}`
        }
      }
    }

    setCandidates(newCandidates)
  }

  const addCandidateField = () => {
    setCandidates([
      ...candidates,
      {
        userId: "",
        candidateId: "",
        name: "",
        position: "",
        bio: "",
        symbol: "",
        agenda: "",
        photo: null,
        photoPreview: null,
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
    ])
  }

  const removeCandidateField = (index) => {
    const newCandidates = candidates.filter((_, i) => i !== index)
    setCandidates(newCandidates)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Validation
    if (new Date(startDate) >= new Date(endDate)) {
      toast.error("End date must be after start date.")
      setIsLoading(false)
      return
    }

    // Validate candidates
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i]
      if (!candidate.userId) {
        toast.error(`Please select a user for candidate ${i + 1}`)
        setIsLoading(false)
        return
      }
      if (!candidate.name.trim()) {
        toast.error(`Candidate ${i + 1} name is required`)
        setIsLoading(false)
        return
      }
      if (!candidate.position.trim()) {
        toast.error(`Position is required for candidate ${i + 1}`)
        setIsLoading(false)
        return
      }
      if (!candidate.bio.trim() || candidate.bio.length < 50) {
        toast.error(`Bio must be at least 50 characters for candidate ${i + 1}`)
        setIsLoading(false)
        return
      }
      if (!candidate.symbol.trim()) {
        toast.error(`Symbol is required for candidate ${i + 1}`)
        setIsLoading(false)
        return
      }
      if (!candidate.agenda.trim() || candidate.agenda.length < 100) {
        toast.error(`Agenda must be at least 100 characters for candidate ${i + 1}`)
        setIsLoading(false)
        return
      }

      if (!candidate.photo) {
        toast.error(`Photo is required for candidate ${i + 1}`)
        setIsLoading(false)
        return
      }

    }

  try {
    const formData = new FormData()

    formData.append("title", title)
    formData.append("description", description)
    formData.append("startDate", startDate)
    formData.append("endDate", endDate)

    // Remove File object from candidates before sending JSON
    const candidatesData = candidates.map(({ photo, photoPreview, ...rest }) => rest)
    formData.append("candidates", JSON.stringify(candidatesData))

    // Append all candidate photos
    candidates.forEach((c) => {
      if (c.photo) {
        formData.append("photos", c.photo) // photo is a File object
      }
    })

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // IMPORTANT
      },
    }

    await axios.post(`${API_URL}/api/elections`, formData, config)
    toast.success("Election created successfully!")
    navigate("/admin/elections")
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to create election.")
    console.error("Create election error:", error)
  }
  setIsLoading(false)
}


  if (loadingUsers) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-neutral-dark mb-8">Create New Election</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg p-8 space-y-8">
        {/* Basic Election Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Election Details</h2>

          <div>
            <label htmlFor="title" className="mb-2">
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
            <label htmlFor="description" className="mb-2">
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
              <label htmlFor="startDate" className="mb-2">
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
                {/* <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
              </div>
            </div>
            <div>
              <label htmlFor="endDate" className="mb-2">
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
                {/* <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
              </div>
            </div>
          </div>
        </div>

        {/* Candidates Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Candidates</h2>
            <button
              type="button"
              onClick={addCandidateField}
              className="btn btn-outline-primary flex items-center text-sm"
            >
              <FaPlus className="mr-2" /> Add Candidate
            </button>
          </div>

          {candidates.map((candidate, index) => (
            <div key={index} className="p-6 border-2 border-gray-200 rounded-lg bg-gray-50 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                  <FaUser className="mr-2" />
                  Candidate {index + 1}
                </h3>
                {candidates.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCandidateField(index)}
                    className="text-red-500 hover:text-red-700 p-2"
                    title="Remove Candidate"
                  >
                    <FaTrashAlt />
                  </button>
                )}
              </div>

              {/* Basic Candidate Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 flex items-center">
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
                  <label className="mb-2 flex items-center">
                    <FaIdCard className="mr-2" />
                    Candidate ID
                  </label>
                  <input
                    type="text"
                    value={candidate.candidateId}
                    onChange={(e) => handleCandidateChange(index, "candidateId", e.target.value)}
                    className="form-input bg-gray-100"
                    placeholder="Auto-generated when user is selected"
                    readOnly
                  />
                </div>

                <div>
                  <label className="mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={candidate.name}
                    onChange={(e) => handleCandidateChange(index, "name", e.target.value)}
                    className="form-input"
                    placeholder="Full Name"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2">Position *</label>
                  <input
                    type="text"
                    value={candidate.position}
                    onChange={(e) => handleCandidateChange(index, "position", e.target.value)}
                    className="form-input"
                    placeholder="e.g., President, Vice President"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center">
                    <FaFlag className="mr-2" />
                    Symbol *
                  </label>
                  <input
                    type="text"
                    value={candidate.symbol}
                    onChange={(e) => handleCandidateChange(index, "symbol", e.target.value)}
                    className="form-input"
                    placeholder="e.g., 🌟, 🚀, 🏆"
                    required
                  />
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="form-label flex items-center">
                  <FaCamera className="mr-2 text-blue-500" />
                  Candidate Photo *
                </label>
                <div className="mt-2">
                  {candidate.photoPreview ? (
                    <div className="relative inline-block">
                      <img
                        src={candidate.photoPreview || "/placeholder.svg"}
                        alt="Candidate preview"
                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <label className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Upload candidate photo
                          </span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={(e) => handlePhotoChange(index, e.target.files[0])}
                          />
                        </label>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio and Agenda */}
              <div className="space-y-4">
                <div>
                  <label className="mb-2 flex items-center">
                    <FaFileAlt className="mr-2" />
                    Bio * (minimum 50 characters)
                  </label>
                  <textarea
                    value={candidate.bio}
                    onChange={(e) => handleCandidateChange(index, "bio", e.target.value)}
                    className="form-input"
                    rows="3"
                    placeholder="Brief biography of the candidate..."
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">{candidate.bio.length}/50 characters minimum</p>
                </div>

                <div>
                  <label className="mb-2 flex items-center">
                    <FaBullhorn className="mr-2" />
                    Campaign Agenda * (minimum 100 characters)
                  </label>
                  <textarea
                    value={candidate.agenda}
                    onChange={(e) => handleCandidateChange(index, "agenda", e.target.value)}
                    className="form-input"
                    rows="4"
                    placeholder="Detailed campaign agenda and promises..."
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
                    <label className="mb-2">Experience</label>
                    <textarea
                      value={candidate.campaignInfo.experience}
                      onChange={(e) => handleCandidateChange(index, "campaignInfo.experience", e.target.value)}
                      className="form-input"
                      rows="3"
                      placeholder="Previous experience and qualifications..."
                    />
                  </div>

                  <div>
                    <label className="mb-2">Education</label>
                    <textarea
                      value={candidate.campaignInfo.education}
                      onChange={(e) => handleCandidateChange(index, "campaignInfo.education", e.target.value)}
                      className="form-input"
                      rows="3"
                      placeholder="Educational background..."
                    />
                  </div>

                  <div>
                    <label className="mb-2">Achievements (one per line)</label>
                    <textarea
                      value={candidate.campaignInfo.achievements}
                      onChange={(e) => handleCandidateChange(index, "campaignInfo.achievements", e.target.value)}
                      className="form-input"
                      rows="3"
                      placeholder="Achievement 1&#10;Achievement 2&#10;Achievement 3"
                    />
                  </div>

                  <div>
                    <label className="mb-2">Campaign Promises (one per line)</label>
                    <textarea
                      value={candidate.campaignInfo.promises}
                      onChange={(e) => handleCandidateChange(index, "campaignInfo.promises", e.target.value)}
                      className="form-input"
                      rows="3"
                      placeholder="Promise 1&#10;Promise 2&#10;Promise 3"
                    />
                  </div>
                </div>

                {/* Social Media */}
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-3">Social Media Links</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2">Website</label>
                      <input
                        type="url"
                        value={candidate.campaignInfo.socialMedia.website}
                        onChange={(e) => handleCandidateChange(index, "socialMedia.website", e.target.value)}
                        className="form-input"
                        placeholder="https://candidate-website.com"
                      />
                    </div>
                    <div>
                      <label className="mb-2">Twitter</label>
                      <input
                        type="url"
                        value={candidate.campaignInfo.socialMedia.twitter}
                        onChange={(e) => handleCandidateChange(index, "socialMedia.twitter", e.target.value)}
                        className="form-input"
                        placeholder="https://twitter.com/candidate"
                      />
                    </div>
                    <div>
                      <label className="mb-2">Facebook</label>
                      <input
                        type="url"
                        value={candidate.campaignInfo.socialMedia.facebook}
                        onChange={(e) => handleCandidateChange(index, "socialMedia.facebook", e.target.value)}
                        className="form-input"
                        placeholder="https://facebook.com/candidate"
                      />
                    </div>
                    <div>
                      <label className="mb-2">LinkedIn</label>
                      <input
                        type="url"
                        value={candidate.campaignInfo.socialMedia.linkedin}
                        onChange={(e) => handleCandidateChange(index, "socialMedia.linkedin", e.target.value)}
                        className="form-input"
                        placeholder="https://linkedin.com/in/candidate"
                      />
                    </div>
                  </div>
                </div>
              </details>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-6 border-t">
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
