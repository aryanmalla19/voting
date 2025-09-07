"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
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
  FaUsers,
  FaChevronDown,
  FaChevronUp,
  FaGlobe,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaCamera,
  FaImage,
  FaBriefcase,
} from "react-icons/fa"
import Spinner from "../../components/layout/Spinner"

const CreateElectionPage = () => {
  const navigate = useNavigate()
  const { token } = useContext(AuthContext)

  const [users, setUsers] = useState([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedPosition, setExpandedPosition] = useState(null)
  const [expandedCandidate, setExpandedCandidate] = useState(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "upcoming",
    positions: [
      {
        positionId: "",
        title: "",
        description: "",
        maxCandidates: 10,
        candidates: [
          {
            userId: "",
            candidateId: "",
            name: "",
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
        ],
      },
    ],
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const res = await axios.get(`${API_URL}/api/users`, config)
      setUsers(res.data.data || [])
    } catch (error) {
      toast.error("Failed to fetch users")
      console.error("Fetch users error:", error)
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePositionChange = (positionIndex, field, value) => {
    const updatedPositions = [...formData.positions]
    updatedPositions[positionIndex][field] = value

    // Auto-generate position ID when title is entered
    if (field === "title" && value && !updatedPositions[positionIndex].positionId) {
      updatedPositions[positionIndex].positionId = `POS_${Date.now()}_${positionIndex}`
    }

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

      // Auto-populate name and generate candidate ID when user is selected
      if (field === "userId" && value) {
        const selectedUser = users.find((user) => user._id === value)
        if (selectedUser) {
          updatedPositions[positionIndex].candidates[candidateIndex].name =
            `${selectedUser.firstName} ${selectedUser.lastName}`
          updatedPositions[positionIndex].candidates[candidateIndex].candidateId =
            `CAND_${Date.now()}_${positionIndex}_${candidateIndex}`
        }
      }
    }

    setFormData({ ...formData, positions: updatedPositions })
  }

  const handlePhotoChange = (positionIndex, candidateIndex, file) => {
    if (file && file.type.startsWith("image/")) {
      const updatedPositions = [...formData.positions]
      updatedPositions[positionIndex].candidates[candidateIndex].photo = file

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        updatedPositions[positionIndex].candidates[candidateIndex].photoPreview = e.target.result
        setFormData({ ...formData, positions: updatedPositions })
      }
      reader.readAsDataURL(file)
    } else {
      toast.error("Please select a valid image file")
    }
  }

  const removePhoto = (positionIndex, candidateIndex) => {
    const updatedPositions = [...formData.positions]
    updatedPositions[positionIndex].candidates[candidateIndex].photo = null
    updatedPositions[positionIndex].candidates[candidateIndex].photoPreview = null
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
          positionId: "",
          title: "",
          description: "",
          maxCandidates: 10,
          candidates: [
            {
              userId: "",
              candidateId: "",
              name: "",
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
          ],
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

      for (let j = 0; j < position.candidates.length; j++) {
        const candidate = position.candidates[j]

        if (!candidate.userId) {
          toast.error(`Please select a user for candidate ${j + 1} in position ${i + 1}`)
          return false
        }

        if (!candidate.name.trim()) {
          toast.error(`Name is required for candidate ${j + 1} in position ${i + 1}`)
          return false
        }

        if (!candidate.bio.trim() || candidate.bio.length < 50) {
          toast.error(`Bio must be at least 50 characters for candidate ${j + 1} in position ${i + 1}`)
          return false
        }

        if (!candidate.symbol.trim()) {
          toast.error(`Symbol is required for candidate ${j + 1} in position ${i + 1}`)
          return false
        }

        if (!candidate.agenda.trim() || candidate.agenda.length < 100) {
          toast.error(`Agenda must be at least 100 characters for candidate ${j + 1} in position ${i + 1}`)
          return false
        }

        if (!candidate.photo) {
          toast.error(`Photo is required for candidate ${j + 1} in position ${i + 1}`)
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
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }

      // Create FormData for file upload
      const submitData = new FormData()
      submitData.append("title", formData.title)
      submitData.append("description", formData.description)
      submitData.append("startDate", formData.startDate)
      submitData.append("endDate", formData.endDate)
      submitData.append("status", formData.status)

      // Add positions data
      formData.positions.forEach((position, positionIndex) => {
        submitData.append(`positions[${positionIndex}][positionId]`, position.positionId)
        submitData.append(`positions[${positionIndex}][title]`, position.title)
        submitData.append(`positions[${positionIndex}][description]`, position.description)
        submitData.append(`positions[${positionIndex}][maxCandidates]`, position.maxCandidates)

        position.candidates.forEach((candidate, candidateIndex) => {
          const prefix = `positions[${positionIndex}][candidates][${candidateIndex}]`

          submitData.append(`${prefix}[userId]`, candidate.userId)
          submitData.append(`${prefix}[candidateId]`, candidate.candidateId)
          submitData.append(`${prefix}[name]`, candidate.name)
          submitData.append(`${prefix}[bio]`, candidate.bio)
          submitData.append(`${prefix}[symbol]`, candidate.symbol)
          submitData.append(`${prefix}[agenda]`, candidate.agenda)

          if (candidate.photo) {
            submitData.append(`candidatePhotos`, candidate.photo)
          }

          // Add campaign info
          submitData.append(`${prefix}[campaignInfo][experience]`, candidate.campaignInfo.experience)
          submitData.append(`${prefix}[campaignInfo][education]`, candidate.campaignInfo.education)
          submitData.append(
            `${prefix}[campaignInfo][achievements]`,
            JSON.stringify(candidate.campaignInfo.achievements),
          )
          submitData.append(`${prefix}[campaignInfo][promises]`, JSON.stringify(candidate.campaignInfo.promises))
          submitData.append(`${prefix}[campaignInfo][socialMedia]`, JSON.stringify(candidate.campaignInfo.socialMedia))
        })
      })

      await axios.post(`${API_URL}/api/elections`, submitData, config)
      toast.success("Election created successfully!")
      navigate("/admin/elections")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create election")
      console.error("Create election error:", error)
    }
    setIsSubmitting(false)
  }

  if (isLoadingUsers) return <Spinner />

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white flex items-center">
              <FaUsers className="mr-3" />
              Create New Election
            </h1>
            <p className="text-blue-100 mt-2">Set up a new election with multiple positions and candidates</p>
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
                    <option value="upcoming">Upcoming</option>
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
                  <label htmlFor="startDate" className="flex items-center">
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
                  <label htmlFor="endDate" className="flex items-center">
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
  <select
    className="form-input"
    value={position.title}
    onChange={(e) => handlePositionChange(positionIndex, "title", e.target.value)}
    required
  >
    <option value="" disabled>
      Select a position
    </option>
    <option value="President">President</option>
    <option value="Vice President">Vice President</option>
    <option value="Secretary">Secretary</option>
    <option value="Treasurer">Treasurer</option>
    <option value="Member">Member</option>
  </select>
</div>

                      <div>
                        <label className="form-label">Max Candidates</label>
                        <input
                          type="number"
                          className="form-input"
                          value={position.maxCandidates}
                          onChange={(e) =>
                            handlePositionChange(positionIndex, "maxCandidates", Number.parseInt(e.target.value))
                          }
                          min="1"
                          max="20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Position Description *</label>
                      <textarea
                        rows="2"
                        className="form-input"
                        value={position.description}
                        onChange={(e) => handlePositionChange(positionIndex, "description", e.target.value)}
                        placeholder="Describe the responsibilities and requirements for this position..."
                        required
                      />
                    </div>

                    {/* Candidates for this position */}
                    {expandedPosition === positionIndex && (
                      <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold text-gray-700 flex items-center">
                            <FaUser className="mr-2 text-blue-500" />
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

                        {position.candidates.map((candidate, candidateIndex) => (
                          <div
                            key={candidateIndex}
                            className="bg-gray-50 rounded-lg border border-gray-200 mb-4 overflow-hidden"
                          >
                            <div className="bg-gray-200 px-4 py-3 flex justify-between items-center">
                              <h5 className="font-medium text-gray-800">
                                Candidate {candidateIndex + 1}: {candidate.name || "Unnamed"}
                              </h5>
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedCandidate(
                                      expandedCandidate === `${positionIndex}-${candidateIndex}`
                                        ? null
                                        : `${positionIndex}-${candidateIndex}`,
                                    )
                                  }
                                  className="text-gray-600 hover:text-gray-800"
                                >
                                  {expandedCandidate === `${positionIndex}-${candidateIndex}` ? (
                                    <FaChevronUp />
                                  ) : (
                                    <FaChevronDown />
                                  )}
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
  <label className="form-label">Symbol *</label>
  <select
    className="form-input"
    value={candidate.symbol}
    onChange={(e) =>
      handleCandidateChange(positionIndex, candidateIndex, "symbol", e.target.value)
    }
    required
  >
    <option value="" disabled>
      Select a symbol
    </option>
    <option value="🌟">🌟 Star</option>
    <option value="🚀">🚀 Rocket</option>
    <option value="🎯">🎯 Target</option>
    <option value="🔥">🔥 Fire</option>
    <option value="🍀">🍀 Clover</option>
    <option value="🌈">🌈 Rainbow</option>
    <option value="💎">💎 Diamond</option>
    <option value="🦄">🦄 Unicorn</option>
    <option value="⚡">⚡ Lightning</option>
    <option value="🎵">🎵 Music</option>
    <option value="🛡️">🛡️ Shield</option>
    <option value="🌹">🌹 Rose</option>
    <option value="🐱">🐱 Cat</option>
    <option value="🐶">🐶 Dog</option>
    <option value="🌞">🌞 Sun</option>
    <option value="🌙">🌙 Moon</option>
    <option value="🍎">🍎 Apple</option>
    <option value="⚽">⚽ Soccer</option>
    <option value="🎲">🎲 Dice</option>
  </select>
</div>

                              </div>

                              <div>
                                <label className="form-label">Candidate Name *</label>
                                <input
                                  type="text"
                                  className="form-input bg-gray-100"
                                  value={candidate.name}
                                  readOnly
                                  placeholder="Auto-filled when user is selected"
                                />
                              </div>

                              {/* Photo Upload */}
                              <div>
                                <label className="flex items-center">
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
                                        onClick={() => removePhoto(positionIndex, candidateIndex)}
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
                                            onChange={(e) =>
                                              handlePhotoChange(positionIndex, candidateIndex, e.target.files[0])
                                            }
                                          />
                                        </label>
                                      </div>
                                      <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                  )}
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
                              {expandedCandidate === `${positionIndex}-${candidateIndex}` && (
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
                                  <div className="bg-gray-50 rounded-lg p-4">
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
                        ))}
                      </div>
                    )}
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
                {isSubmitting ? "Creating..." : "Create Election"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateElectionPage
