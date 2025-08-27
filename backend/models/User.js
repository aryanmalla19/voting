const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please add a first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please add a last name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"],
  },
  role: {
    type: String,
    enum: ["voter", "admin"],
    default: "voter",
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "pending"],
    default: "pending",
  },
  // ID Verification (Passport or License)
  idType: {
    type: String,
    enum: ["passport", "license"],
    required: [true, "Please select ID type"],
  },
  idNumber: {
    type: String,
    required: [true, "Please add ID number"],
    unique: true,
  },
  idPlaceOfIssue: {
    type: String,
    default: "Someplace",
    required: [true, "Please add place of issue"],
  },
  idExpiryDate: {
    type: Date,
    required: [true, "Please add expiry date"],
  },
  // Email Verification
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  // Password Reset
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  // Two-Factor Authentication
  twoFactorSecret: String,
  isTwoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  // Additional Info
  dateOfBirth: {
    type: Date,
    required: [true, "Please add date of birth"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please add phone number"],
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  votingHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
    },
  ],
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

UserSchema.methods.getEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(20).toString("hex")
  this.emailVerificationToken = crypto.createHash("sha256").update(verificationToken).digest("hex")
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  return verificationToken
}

UserSchema.methods.updateStatus = function () {
  if (this.isEmailVerified) {
    this.status = "active"
  } else {
    this.status = "pending"
  }
}

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex")
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000 // 10 minutes
  return resetToken
}

module.exports = mongoose.model("User", UserSchema)
