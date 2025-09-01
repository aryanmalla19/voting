// This file remains the same. Path: backend/controllers/votes.js
const Election = require("../models/Election")
const Vote = require("../models/Vote")
const { encryptVote, generateVerificationCode } = require("../utils/encryption")


exports.castVote = async (req, res) => {
  try {
    const { electionId, votes } = req.body // votes is an array of { positionId, candidateId }

    if (!electionId || !votes || !Array.isArray(votes) || votes.length === 0) {
      return res.status(400).json({ message: "Election ID and votes array required" })
    }

    const election = await Election.findById(electionId)
    if (!election) return res.status(404).json({ message: "Election not found" })

    await election.updateStatus()
    if (election.status !== "active") {
      return res.status(400).json({ message: "Voting not active for this election" })
    }

    // Validate all votes before casting any
    const validatedVotes = []
    const verificationCodes = []

    for (const vote of votes) {
      const { positionId, candidateId } = vote

      if (!positionId || !candidateId) {
        return res.status(400).json({ message: "Position ID and candidate ID required for each vote" })
      }

      // Check if user already voted for this position
      const existingVote = await Vote.findOne({
        election: electionId,
        voter: req.user.id,
        positionId,
      })

      if (existingVote) {
        return res.status(400).json({
          message: `You have already voted for position: ${existingVote.positionTitle}`,
        })
      }

      // Find the position and validate candidate
      const position = election.positions.find((p) => p.positionId === positionId)
      if (!position) {
        return res.status(400).json({ message: `Invalid position: ${positionId}` })
      }

      const candidate = position.candidates.find((c) => c.candidateId === candidateId)
      if (!candidate) {
        return res.status(400).json({ message: `Invalid candidate for position ${position.title}` })
      }

      validatedVotes.push({
        positionId,
        positionTitle: position.title,
        candidateId,
        candidateName: candidate.name,
      })
    }

    // Cast all votes
    for (const vote of validatedVotes) {
      const encryptedVote = encryptVote(
        {
          candidateId: vote.candidateId,
          positionId: vote.positionId,
        },
        election.publicKey,
      )

      const verificationCode = generateVerificationCode()

      await Vote.create({
        election: electionId,
        voter: req.user.id,
        positionId: vote.positionId,
        positionTitle: vote.positionTitle,
        encryptedVote,
        verificationCode,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      })

      verificationCodes.push({
        position: vote.positionTitle,
        candidate: vote.candidateName,
        verificationCode,
      })
    }

    res.status(201).json({
      success: true,
      data: {
        message: `Successfully voted for ${validatedVotes.length} position(s)`,
        verificationCodes,
      },
    })
  } catch (error) {
    console.error("Cast vote error:", error)
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
      data: {
        verified: true,
        electionId: vote.election,
        position: vote.positionTitle,
        timestamp: vote.timestamp,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}


exports.getVotingHistory = async (req, res) => {
  try {
    const votes = await Vote.find({ voter: req.user.id }).populate({
      path: "election",
      select: "title startDate endDate status",
    })

    // Group votes by election
    const votingHistory = {}
    votes.forEach((vote) => {
      const electionId = vote.election._id.toString()
      if (!votingHistory[electionId]) {
        votingHistory[electionId] = {
          id: vote._id,
          electionId: vote.election._id,
          electionTitle: vote.election.title,
          electionStatus: vote.election.status,
          votes: [],
        }
      }
      votingHistory[electionId].votes.push({
        position: vote.positionTitle,
        votedOn: vote.timestamp,
        verificationCode: vote.verificationCode,
      })
    })

    res.status(200).json({
      success: true,
      data: Object.values(votingHistory),
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

exports.checkVotingStatus = async (req, res) => {
  try {
    const { electionId } = req.params

    const election = await Election.findById(electionId)
    if (!election) return res.status(404).json({ message: "Election not found" })

    const userVotes = await Vote.find({
      election: electionId,
      voter: req.user.id,
    })

    const votedPositions = userVotes.map((vote) => vote.positionId)
    const remainingPositions = election.positions.filter((position) => !votedPositions.includes(position.positionId))

    res.status(200).json({
      success: true,
      data: {
        hasVotedAll: remainingPositions.length === 0,
        votedPositions,
        remainingPositions: remainingPositions.map((p) => ({
          positionId: p.positionId,
          title: p.title,
        })),
        totalPositions: election.positions.length,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
