// This file remains the same. Path: backend/routes/votes.js
const express = require("express")
const { castVote, verifyVote, getVotingHistory, checkVotingStatus } = require("../controllers/votes")
const { protect } = require("../middleware/auth")

const router = express.Router()

router.post("/", protect, castVote)
router.post("/verify", protect, verifyVote)
router.get("/history", protect, getVotingHistory)
router.get("/status/:electionId", protect, checkVotingStatus)

module.exports = router
