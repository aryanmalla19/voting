// This file remains the same. Path: backend/routes/elections.js
const upload = require("../middleware/upload");
const express = require("express")
const {
  getElections,
  getElection,
  createElection,
  updateElection,
  deleteElection,
  getElectionResults,
} = require("../controllers/elections")
const { protect, admin } = require("../middleware/auth")
const router = express.Router()
router.route("/").get(getElections).post(protect, admin, upload.array("candidatePhotos"), createElection)
router.route("/:id").get(getElection).put(protect, admin, updateElection).delete(protect, admin, deleteElection)
router.get("/:id/results", getElectionResults) // Publicly accessible results
module.exports = router
