const express = require("express")
const { getUsers, getUser, createUser, updateUser, deleteUser } = require("../controllers/users")
const { protect, admin } = require("../middleware/auth")

const router = express.Router()

// All routes below are protected and require admin privileges
router.use(protect)
router.use(admin)

router.route("/").get(getUsers).post(createUser)
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser)

module.exports = router
