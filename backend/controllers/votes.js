// This file remains the same. Path: backend/controllers/votes.js
const Election = require("../models/Election")
const Vote = require("../models/Vote")
const { encryptVote, generateVerificationCode } = require("../utils/encryption")

exports.castVote = async (req, res) => {
  try {
    const { electionId, candidateId } = req.body
    if (!electionId || !candidateId) return res.status(400).json({ message: "Election and candidate ID required" })

    const election = await Election.findById(electionId)
    if (!election) return res.status(404).json({ message: "Election not found" })
    await election.updateStatus()
    if (election.status !== "active") return res.status(400).json({ message: "Voting not active for this election" })

    const existingVote = await Vote.findOne({ election: electionId, voter: req.user.id })
    if (existingVote) return res.status(400).json({ message: "You have already voted in this election" })

    const candidateIndex = election.candidates.findIndex(
      (c) => c._id.toString() === candidateId
    )
    if (candidateIndex === -1) {
      return res.status(400).json({ message: "Invalid candidate" })
    }

    const encryptedVote = encryptVote({ candidateId }, election.publicKey)
    const verificationCode = generateVerificationCode()

    const vote = await Vote.create({
      election: electionId,
      voter: req.user.id,
      encryptedVote,
      verificationCode,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    })

    // Increment candidate’s vote count inside election
    election.candidates[candidateIndex].votes = (election.candidates[candidateIndex].votes || 0) + 1
    election.totalVotes = (election.totalVotes || 0) + 1
    await election.save()

    // It's better to update user in the user model or service if needed,
    // but for simplicity, if User model has votingHistory:
    // await User.findByIdAndUpdate(req.user.id, { $push: { votingHistory: electionId } });

    res.status(201).json({ success: true, data: { verificationCode: vote.verificationCode } })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

exports.verifyVote = async (req, res) => {
  try {
    const { verificationCode } = req.body
    if (!verificationCode) return res.status(400).json({ message: "Verification code required" })

    const vote = await Vote.findOne({ verificationCode })
    if (!vote) return res.status(404).json({ message: "Vote not found with this verification code" })

    res.status(200).json({
      success: true,
      data: { verified: true, electionId: vote.election, timestamp: vote.timestamp },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

exports.getVotingHistory = async (req, res) => {
  try {
    const votes = await Vote.find({ voter: req.user.id }).populate({
      path: "election",
      select: "title startDate endDate status", // Select specific fields from election
    })

    const votingHistory = votes.map((vote) => ({
      id: vote._id,
      electionId: vote.election._id,
      electionTitle: vote.election.title,
      votedOn: vote.timestamp,
      verificationCode: vote.verificationCode,
      electionStatus: vote.election.status,
    }))
    res.status(200).json({ success: true, data: votingHistory })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
