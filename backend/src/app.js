const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const memberRoutes = require("./routes/memberRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Security
app.use(helmet());

// Enable CORS
app.use(cors());

// Parse JSON requests
app.use(express.json());

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());

// HTTP request logger
app.use(morgan("dev"));

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/dashboard", dashboardRoutes);
// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;