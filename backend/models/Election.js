const mongoose = require("mongoose")

const CandidateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Candidate must be a registered user"],
  },
  candidateId: {
    type: String,
    required: [true, "Candidate ID is required"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Candidate name is required"],
  },
  position: {
    type: String,
    required: [true, "Position is required"],
  },
  bio: {
    type: String,
    required: [true, "Bio is required"],
    minlength: [50, "Bio must be at least 50 characters"],
  },
  symbol: {
    type: String,
    required: [true, "Candidate symbol is required"],
  },
  agenda: {
    type: String,
    required: [true, "Candidate agenda is required"],
    minlength: [100, "Agenda must be at least 100 characters"],
  },
  campaignInfo: {
    experience: String,
    education: String,
    achievements: [String],
    promises: [String],
    socialMedia: {
      website: String,
      twitter: String,
      facebook: String,
      linkedin: String,
    },
  },
  votes: {
    type: Number,
    default: 0,
  },
  photo: {
  type: String,
  default: null,
  }
})

const ElectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
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
    enum: ["upcoming", "active", "completed"],
    default: "upcoming",
  },
  candidates: [CandidateSchema],
  eligibleVoters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  totalVotes: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  publicKey: {
  type: String,
  required: true,
  },
  privateKey: {
    type: String,
    required: true,
  },
})

ElectionSchema.pre("save", function (next) {
  const now = new Date()
  if (this.startDate <= now && this.endDate > now) {
    this.status = "active"
  } else if (this.endDate <= now) {
    this.status = "completed"
  } else {
    this.status = "upcoming"
  }
  next()
})

ElectionSchema.methods.updateStatus = function () {
  const now = new Date()
  if (this.startDate <= now && this.endDate > now) {
    this.status = "active"
  } else if (this.endDate <= now) {
    this.status = "completed"
  } else {
    this.status = "upcoming"
  }
}


module.exports = mongoose.model("Election", ElectionSchema)
