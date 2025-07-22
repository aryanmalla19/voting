const User = require("../models/User")

exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "" } = req.query

    const query = {}
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ]
    }
    if (status) {
      query.status = status
    }

    const users = await User.find(query)
      .select("-password -emailVerificationToken -resetPasswordToken -twoFactorSecret")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await User.countDocuments(query)

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -emailVerificationToken -resetPasswordToken -twoFactorSecret",
    )
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

exports.updateUser = async (req, res) => {
  try {
    const { status, role } = req.body
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status, role },
      { new: true, runValidators: true },
    ).select("-password -emailVerificationToken -resetPasswordToken -twoFactorSecret")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    await User.findByIdAndDelete(req.params.id)
    res.status(200).json({ success: true, message: "User deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.status(201).json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
