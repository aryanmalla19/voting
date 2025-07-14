const User = require("../models/User")
const Election = require("../models/Election")
const asyncHandler = require("../middleware/async")

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = asyncHandler(async (req, res, next) => {
  const totalUsers = await User.countDocuments()
  const totalElections = await Election.countDocuments()

  // Update status for all elections before counting active ones
  const elections = await Election.find({})
  await Promise.all(elections.map((election) => election.updateStatus()))

  const activeElections = await Election.countDocuments({ status: "active" })

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalElections,
      activeElections,
    },
  })
})
