require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default route
app.get("/", (req, res) => {
    res.send("Backend server is running...");
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
