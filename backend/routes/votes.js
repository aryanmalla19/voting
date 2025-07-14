// This file remains the same. Path: backend/routes/votes.js
const express = require("express")
const { castVote, verifyVote, getVotingHistory } = require("../controllers/votes")
const { protect } = require("../middleware/auth")
const router = express.Router()
router.post("/", protect, castVote)
router.post("/verify", verifyVote) // Public or protected depending on requirements
router.get("/history", protect, getVotingHistory)
module.exports = router
