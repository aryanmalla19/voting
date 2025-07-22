const User = require("../models/User")
const crypto = require("crypto")
const nodemailer = require("nodemailer")

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail", // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

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
        isEmailVerified: user.isEmailVerified,
        status: user.status,
      },
    })
}

const sendVerificationEmail = async (user, verificationToken) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`

  const message = `
    <h1>Email Verification</h1>
    <p>Please click the link below to verify your email address:</p>
    <a href="${verificationUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
    <p>This link will expire in 24 hours.</p>
  `

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Email Verification - SecureVote",
    html: message,
  })
}

exports.register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      idType,
      idNumber,
      idPlaceOfIssue,
      idExpiryDate,
      dateOfBirth,
      phoneNumber,
      address,
    } = req.body

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { idNumber }] })
    if (userExists) {
      return res.status(400).json({
        message: userExists.email === email ? "Email already registered" : "ID number already registered",
      })
    }

    // Validate ID expiry date
    if (new Date(idExpiryDate) <= new Date()) {
      return res.status(400).json({ message: "ID document has expired" })
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      idType,
      idNumber,
      idPlaceOfIssue,
      idExpiryDate,
      dateOfBirth,
      phoneNumber,
      address,
    })

    // Generate email verification token
    const verificationToken = user.getEmailVerificationToken()
    await user.save()

    // Send verification email
    await sendVerificationEmail(user, verificationToken)

    res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email to verify your account.",
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params
    const emailVerificationToken = crypto.createHash("sha256").update(token).digest("hex")

    const user = await User.findOne({
      emailVerificationToken,
      emailVerificationExpire: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification token" })
    }

    user.isEmailVerified = true
    user.status = "active"
    user.emailVerificationToken = undefined
    user.emailVerificationExpire = undefined
    await user.save()

    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now login.",
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" })
    }

    const user = await User.findOne({ email }).select("+password")
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    if (!user.isEmailVerified) {
      return res.status(401).json({ message: "Please verify your email before logging in" })
    }

    if (user.status !== "active") {
      return res.status(401).json({ message: "Account is not active. Please contact support." })
    }

    user.lastLogin = Date.now()
    await user.save()
    sendTokenResponse(user, 200, res)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email is already verified" })
    }

    const verificationToken = user.getEmailVerificationToken()
    await user.save()
    await sendVerificationEmail(user, verificationToken)

    res.status(200).json({
      success: true,
      message: "Verification email sent successfully",
    })
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
    res.status(200).json({ success: true, data: req.user })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
