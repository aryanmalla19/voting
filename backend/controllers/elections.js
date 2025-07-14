// This file remains the same. Path: backend/controllers/elections.js
const Election = require("../models/Election")
const Vote = require("../models/Vote")
const { generateKeyPair, decryptVote } = require("../utils/encryption") // decryptVote might be needed here

exports.getElections = async (req, res) => {
  try {
    const elections = await Election.find().select("-privateKey").populate("createdBy", "firstName lastName")
    await Promise.all(elections.map((election) => election.updateStatus()))
    res.status(200).json({ success: true, count: elections.length, data: elections })
  } catch (error) {
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
    const election = await Election.create(req.body)
    res.status(201).json({ success: true, data: election })
  } catch (error) {
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
  const candidateVotes = {}
  election.candidates.forEach((candidate) => (candidateVotes[candidate._id.toString()] = 0))

  votes.forEach((vote) => {
    try {
      const decryptedVote = decryptVote(vote.encryptedVote, election.privateKey)
      if (decryptedVote && decryptedVote.candidateId && candidateVotes.hasOwnProperty(decryptedVote.candidateId)) {
        candidateVotes[decryptedVote.candidateId]++
      }
    } catch (e) {
      console.error("Error decrypting vote:", e) // Log decryption errors
    }
  })

  const totalVotes = Object.values(candidateVotes).reduce((sum, count) => sum + count, 0)

  const candidateResults = election.candidates.map((candidate) => {
    const votesForCandidate = candidateVotes[candidate._id.toString()] || 0
    const percentage = totalVotes > 0 ? (votesForCandidate / totalVotes) * 100 : 0
    return {
      id: candidate._id,
      name: candidate.name,
      position: candidate.position,
      votes: votesForCandidate,
      percentage: Number.parseFloat(percentage.toFixed(2)),
    }
  })

  candidateResults.sort((a, b) => b.votes - a.votes)

  return {
    id: election._id,
    title: election.title,
    description: election.description,
    startDate: election.startDate,
    endDate: election.endDate,
    status: election.status,
    totalVotes,
    candidates: candidateResults,
    verifiedVotes: votes.map((vote) => vote.verificationCode), // For client-side verification check
  }
}

exports.getElectionResults = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id)
      .select("+privateKey") // Ensure privateKey is selected
      .populate("createdBy", "firstName lastName")

    if (!election) return res.status(404).json({ message: "Election not found" })
    await election.updateStatus()
    if (election.status !== "completed") {
      return res.status(400).json({ message: "Results only available for completed elections" })
    }

    const votes = await Vote.find({ election: req.params.id })
    const results = calculateResults(election, votes)
    res.status(200).json({ success: true, data: results })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
