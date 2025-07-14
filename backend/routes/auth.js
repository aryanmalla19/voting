// This file remains the same. Path: backend/routes/auth.js
const express = require("express")
const { register, login, logout, getMe } = require("../controllers/auth")
const { protect } = require("../middleware/auth")
const router = express.Router()
router.post("/register", register)
router.post("/login", login)
router.get("/logout", logout) // Consider making this POST for CSRF protection if sensitive
router.get("/me", protect, getMe)
module.exports = router
