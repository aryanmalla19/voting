const express = require("express")
const { getAdminStats } = require("../controllers/adminStats")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

router.use(protect)
router.use(authorize("admin"))

router.get("/stats", getAdminStats)

module.exports = router
