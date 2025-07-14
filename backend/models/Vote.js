// This file remains the same. Path: backend/models/Vote.js
const mongoose = require("mongoose")

const VoteSchema = new mongoose.Schema({
  election: { type: mongoose.Schema.Types.ObjectId, ref: "Election", required: true },
  voter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  encryptedVote: { type: String, required: true },
  verificationCode: { type: String, required: true, unique: true },
  timestamp: { type: Date, default: Date.now },
  ipAddress: String,
  userAgent: String,
})

VoteSchema.index({ election: 1, voter: 1 }, { unique: true })

module.exports = mongoose.model("Vote", VoteSchema)
