// This file remains the same. Path: backend/routes/admin.js
const express = require("express")
const { protect, admin } = require("../middleware/auth")
const {getAdminStats} = require("../controllers/adminStats")
const router = express.Router()
// Placeholder routes - implement controllers for these
router.get("/dashboard", protect, admin, (req, res) =>
  res.status(501).json({ message: "Admin dashboard data not implemented" }),
)
router.get("/stats", protect, admin, getAdminStats);
module.exports = router
