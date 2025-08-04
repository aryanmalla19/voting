const express = require("express")
const { register, login, logout, getMe, verifyEmail, resendVerification, forgotPassword, verifyResetToken, resetPassword } = require("../controllers/auth")
const { protect } = require("../middleware/auth")

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/logout", logout)
router.get("/me", protect, getMe)
router.get("/verify-email/:token", verifyEmail)
router.post("/resend-verification", resendVerification)
router.post("/forgot-password", forgotPassword)
router.get("/verify-reset-token/:token", verifyResetToken)
router.put("/reset-password/:token", resetPassword)

module.exports = router
