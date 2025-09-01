// This file remains the same. Path: backend/controllers/elections.js
const Election = require("../models/Election")
const Vote = require("../models/Vote")
const { generateKeyPair, decryptVote } = require("../utils/encryption") // decryptVote might be needed here

exports.getElections = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "" } = req.query

    const query = {}
    if (search) {
      query.title = { $regex: search, $options: "i" }
    }
    if (status) {
      query.status = status
    }

    const total = await Election.countDocuments(query)

    let elections = await Election.find(query)
      .select("-privateKey")
      .populate("createdBy", "firstName lastName")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 })

    // Update statuses dynamically
    elections = await Promise.all(
      elections.map(async (election) => {
        election.updateStatus()
        await election.save({ validateBeforeSave: false })
        return election
      })
    )

    res.status(200).json({
      success: true,
      count: elections.length,
      data: elections,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}


exports.getElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id)
      .select("-privateKey")
      .populate("createdBy", "firstName lastName")
    if (!election) return res.status(404).json({ message: "Election not found" })
    await election.updateStatus()
    res.status(200).json({ success: true, data: election })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

exports.createElection = async (req, res) => {
  try {
    const { publicKey, privateKey } = generateKeyPair()
    req.body.createdBy = req.user.id
    req.body.publicKey = publicKey
    req.body.privateKey = privateKey

    // Generate position IDs if not provided
    if (req.body.positions) {
      req.body.positions.forEach((position, index) => {
        if (!position.positionId) {
          position.positionId = `POS_${Date.now()}_${index}`
        }
        // Generate candidate IDs if not provided
        position.candidates.forEach((candidate, candidateIndex) => {
          if (!candidate.candidateId) {
            candidate.candidateId = `CAND_${Date.now()}_${index}_${candidateIndex}`
          }
          candidate.photo = req.files && req.files[candidateIndex] ? req.files[candidateIndex].path : candidate.photo || "";
          candidate.campaignInfo.socialMedia = JSON.parse(candidate.campaignInfo.socialMedia) || "";
          candidate.campaignInfo.achievements = JSON.parse(candidate.campaignInfo.achievements) || "";
          candidate.campaignInfo.promises = JSON.parse(candidate.campaignInfo.promises) || "";
        })
      })
    }
    const election = await Election.create(req.body)
    res.status(201).json({ success: true, data: election })
  } catch (error) {
    console.error("Create election error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

exports.updateElection = async (req, res) => {
  try {
    let election = await Election.findById(req.params.id)
    if (!election) return res.status(404).json({ message: "Election not found" })
    if (election.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({ message: "Not authorized" })
    }
    if (election.status === "active" || election.status === "completed") {
      return res.status(400).json({ message: "Cannot update active or completed elections" })
    }
    election = await Election.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    res.status(200).json({ success: true, data: election })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

exports.deleteElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id)
    if (!election) return res.status(404).json({ message: "Election not found" })
    if (election.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({ message: "Not authorized" })
    }
    if (election.status === "active" || election.status === "completed") {
      return res.status(400).json({ message: "Cannot delete active or completed elections" })
    }
    await Election.deleteOne({ _id: req.params.id }) // Use deleteOne
    res.status(200).json({ success: true, data: {} })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}


const calculateResults = (election, votes) => {
  const results = {
    id: election._id,
    title: election.title,
    description: election.description,
    startDate: election.startDate,
    endDate: election.endDate,
    status: election.status,
    totalVotes: votes.length,
    positions: [],
    verifiedVotes: votes.map((vote) => vote.verificationCode),
  }

  // Calculate results for each position
  election.positions.forEach((position) => {
    const positionVotes = votes.filter((vote) => vote.positionId === position.positionId)
    const candidateVotes = {}

    // Initialize vote counts
    position.candidates.forEach((candidate) => {
      candidateVotes[candidate.candidateId] = 0
    })

    // Count votes
    positionVotes.forEach((vote) => {
      try {
        const decryptedVote = decryptVote(vote.encryptedVote, election.privateKey)
        if (decryptedVote && decryptedVote.candidateId && candidateVotes.hasOwnProperty(decryptedVote.candidateId)) {
          candidateVotes[decryptedVote.candidateId]++
        }
      } catch (e) {
        console.error("Error decrypting vote:", e)
      }
    })

    const totalPositionVotes = Object.values(candidateVotes).reduce((sum, count) => sum + count, 0)

    const candidateResults = position.candidates.map((candidate) => {
      const votesForCandidate = candidateVotes[candidate.candidateId] || 0
      const percentage = totalPositionVotes > 0 ? (votesForCandidate / totalPositionVotes) * 100 : 0
      return {
        id: candidate._id,
        candidateId: candidate.candidateId,
        name: candidate.name,
        votes: votesForCandidate,
        percentage: Number.parseFloat(percentage.toFixed(2)),
        photo: candidate.photo,
        symbol: candidate.symbol,
      }
    })

    candidateResults.sort((a, b) => b.votes - a.votes)

    results.positions.push({
      positionId: position.positionId,
      title: position.title,
      description: position.description,
      totalVotes: totalPositionVotes,
      candidates: candidateResults,
      winner: candidateResults[0] || null,
    })
  })

  return results
}

exports.getElectionResults = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id)
      .select("+privateKey") // Ensure privateKey is selected
      .populate("createdBy", "firstName lastName")

    if (!election) return res.status(404).json({ message: "Election not found" })
    await election.updateStatus()
    // if (election.status !== "completed") {
    //   return res.status(400).json({ message: "Results only available for completed elections" })
    // }

    const votes = await Vote.find({ election: req.params.id })
    const results = calculateResults(election, votes)
    res.status(200).json({ success: true, data: results })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
