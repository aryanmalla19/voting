const User = require("../models/User")
const Election = require("../models/Election")
const Vote = require("../models/Vote")

exports.getAdminStats = async (req, res) => {
  try {
    // Get user statistics
    const totalUsers = await User.countDocuments()
    const activeUsers = await User.countDocuments({ status: "active" })
    const pendingUsers = await User.countDocuments({ status: "pending" })
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true })

    // Get election statistics
    const totalElections = await Election.countDocuments()
    const activeElections = await Election.countDocuments({ status: "active" })
    const upcomingElections = await Election.countDocuments({ status: "upcoming" })
    const completedElections = await Election.countDocuments({ status: "completed" })

    // Get voting statistics
    const totalVotes = await Vote.countDocuments()
    const todayVotes = await Vote.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    })

    // Recent activity
    const recentUsers = await User.find()
      .select("firstName lastName email createdAt status")
      .sort({ createdAt: -1 })
      .limit(5)

    const recentElections = await Election.find()
      .select("title status startDate endDate")
      .sort({ createdAt: -1 })
      .limit(5)

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          pending: pendingUsers,
          verified: verifiedUsers,
        },
        elections: {
          total: totalElections,
          active: activeElections,
          upcoming: upcomingElections,
          completed: completedElections,
        },
        votes: {
          total: totalVotes,
          today: todayVotes,
        },
        recentActivity: {
          users: recentUsers,
          elections: recentElections,
        },
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
