// This file remains the same. Path: backend/controllers/auth.js
const User = require("../models/User")

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken()
  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  }
  if (process.env.NODE_ENV === "production") options.secure = true

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    })
}

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) return res.status(400).json({ message: "User already exists" })

    const user = await User.create({ firstName, lastName, email, password })
    sendTokenResponse(user, 201, res)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: "Please provide email and password" })

    const user = await User.findOne({ email }).select("+password")
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    user.lastLogin = Date.now()
    await user.save()
    sendTokenResponse(user, 200, res)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

exports.logout = (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })
  res.status(200).json({ success: true, data: {} })
}

exports.getMe = async (req, res) => {
  try {
    // req.user is already populated by the 'protect' middleware
    res.status(200).json({ success: true, data: req.user })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
