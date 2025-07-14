const User = require("../models/User")
const asyncHandler = require("../middleware/async") // Assuming you have an asyncHandler middleware

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().select("-password") // Exclude password
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  })
})

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password")

  if (!user) {
    return res.status(404).json({ success: false, message: `User not found with id of ${req.params.id}` })
  }

  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc    Create user (Admin only for now, registration is separate)
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body

  // Basic validation
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ success: false, message: "Please provide all required fields" })
  }

  const userExists = await User.findOne({ email })
  if (userExists) {
    return res.status(400).json({ success: false, message: "User already exists with this email" })
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password, // Password will be hashed by the pre-save hook in User model
    role: role || "voter", // Default to voter if not specified
  })

  // Don't send password back, even hashed
  const userResponse = { ...user._doc }
  delete userResponse.password

  res.status(201).json({
    success: true,
    data: userResponse,
  })
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  // Fields that admin can update
  const { firstName, lastName, email, role, status } = req.body

  const user = await User.findById(req.params.id)

  if (!user) {
    return res.status(404).json({ success: false, message: `User not found with id of ${req.params.id}` })
  }

  // Update fields if provided
  if (firstName) user.firstName = firstName
  if (lastName) user.lastName = lastName
  if (email) user.email = email // Consider email uniqueness check if changed
  if (role) user.role = role
  if (status) user.status = status // Assuming 'status' is a field in your User model

  await user.save()

  // Don't send password back
  const userResponse = { ...user._doc }
  delete userResponse.password

  res.status(200).json({
    success: true,
    data: userResponse,
  })
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return res.status(404).json({ success: false, message: `User not found with id of ${req.params.id}` })
  }

  // Add any pre-delete logic here (e.g., check if user is deletable)
  // For example, prevent deleting the last admin or self-deletion by admin
  if (user.role === "admin" && req.user.id === user._id.toString()) {
    return res.status(400).json({ success: false, message: "Admin cannot delete themselves." })
  }

  await User.deleteOne({ _id: req.params.id })

  res.status(200).json({
    success: true,
    data: {},
    message: "User deleted successfully",
  })
})
