// This file remains the same as in the previous MERN example.
// Path: backend/server.js
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")
const cookieParser = require("cookie-parser")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")

// Routes
const authRoutes = require("./routes/auth")
const electionRoutes = require("./routes/elections")
const voteRoutes = require("./routes/votes")
const userRoutes = require("./routes/users")
const adminRoutes = require("./routes/admin")

dotenv.config()

const app = express()

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Ensure this matches your frontend URL
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
})
app.use("/api/", apiLimiter)

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/elections", electionRoutes)
app.use("/api/votes", voteRoutes)
app.use("/api/users", userRoutes)
app.use("/api/admin", adminRoutes)

// Serve static assets in production (if frontend is built into backend/public or similar)
// If deploying frontend and backend separately, this part might not be needed here.
if (process.env.NODE_ENV === "production") {
  // Adjust the path to your frontend build directory
  app.use(express.static(path.join(__dirname, "../frontend/build")))
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"))
  })
}

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`))
