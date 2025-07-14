// This file remains the same. Path: backend/models/Election.js
const mongoose = require("mongoose")

const ElectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    trim: true,
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  startDate: {
    type: Date,
    required: [true, "Please add a start date"],
  },
  endDate: {
    type: Date,
    required: [true, "Please add an end date"],
  },
  status: {
    type: String,
    enum: ["upcoming", "active", "completed", "cancelled"],
    default: "upcoming",
  },
  candidates: [
    {
      name: { type: String, required: true },
      description: String,
      position: String,
      image: String, // URL to candidate image
    },
  ],
  eligibleVoters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  publicKey: { type: String, required: true },
  privateKey: { type: String, required: true, select: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
})

ElectionSchema.methods.updateStatus = async function () {
  const now = new Date()
  let newStatus = this.status
  if (this.status !== "cancelled") {
    if (now < this.startDate) newStatus = "upcoming"
    else if (now >= this.startDate && now <= this.endDate) newStatus = "active"
    else if (now > this.endDate) newStatus = "completed"
  }
  if (newStatus !== this.status) {
    this.status = newStatus
    await this.save()
  }
}

module.exports = mongoose.model("Election", ElectionSchema)
