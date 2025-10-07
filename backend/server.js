require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true, limit: "500mb" }));

// Routes
app.use("/api/analyze", require("./routes/analyze"));

// Default route
app.get("/", (req, res) => {
    res.send("Backend server is running...");
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error("Server error:", error.message);
    res.status(500).json({
        success: false,
        error: "Internal server error",
    });
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
