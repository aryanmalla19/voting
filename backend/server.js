const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose") 

// Load env vars
dotenv.config()

// Connect to database
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

const app = express()

// Body parser
app.use("/uploads", express.static("uploads"));
app.use(express.json())
app.use(cookieParser())

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
)

// Route files
const auth = require("./routes/auth")
const users = require("./routes/users")
const elections = require("./routes/elections")
const votes = require("./routes/votes")
const admin = require("./routes/admin")


// Mount routers
app.use("/api/auth", auth)
app.use("/api/users", users)
app.use("/api/elections", elections)
app.use("/api/votes", votes)
app.use("/api/admin", admin)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`)
  server.close(() => {
    process.exit(1)
  })
})
