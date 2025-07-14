const express = require("express")
const { getAdminStats } = require("../controllers/adminStats")
const { protect, admin } = require("../middleware/auth")

const router = express.Router()

router.route("/stats").get(protect, admin, getAdminStats)

module.exports = router
