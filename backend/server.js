
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");

require("dotenv").config();
const db = require("./config/db");

const app = express();

// Middleware
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true
    })
);
app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/api/auth", authRoutes);



// Test API
app.get("/", (req, res) => {
    res.send("Login Application Backend is Running!");
});

// Health Check API
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend API is working successfully"
    });
});


app.get("/api/db-test", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT DATABASE() AS database_name"
        );

        res.status(200).json({
            success: true,
            message: "MySQL Database Connected Successfully",
            database: rows[0].database_name
        });

    } catch (error) {
        console.error("Database Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Database Connection Failed"
        });
    }
});


// Server Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
