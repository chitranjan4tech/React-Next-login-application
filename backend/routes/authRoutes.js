
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// POST: User Registration
router.post("/register", async (req, res) => {
    try {
        // 1. Receive data from frontend
        const { name, email, mobile, password } = req.body || {};

        // 2. Validate required fields
        if (!name || !email || !mobile || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // 3. Clean and normalize input
        const userName = name.trim();
        const userEmail = email.trim().toLowerCase();
        const userMobile = mobile.trim();

        if (!userName || !userEmail || !userMobile) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid details"
            });
        }

        // 4. Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(userEmail)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email address"
            });
        }

        // 5. Validate mobile number
        if (!/^\d{10}$/.test(userMobile)) {
            return res.status(400).json({
                success: false,
                message: "Mobile number must be 10 digits"
            });
        }

        // 6. Validate password
        if (typeof password !== "string" || password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

        // 7. Check duplicate email
        const [existingUsers] = await db.execute(
            "SELECT id FROM users WHERE email = ?",
            [userEmail]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        // 8. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 9. Insert user into MySQL
        const [result] = await db.execute(
            `INSERT INTO users (name, email, mobile, password)
             VALUES (?, ?, ?, ?)`,
            [userName, userEmail, userMobile, hashedPassword]
        );

        // 10. Send success response
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: result.insertId,
                name: userName,
                email: userEmail,
                mobile: userMobile
            }
        });

    } catch (error) {
        console.error("Registration Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Registration failed. Please try again."
        });
    }
});




// POST: User Login
router.post("/login", async (req, res) => {
    try {
        // 1. Receive login details
        const { email, password } = req.body || {};

        // 2. Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        if (typeof email !== "string" ||
            typeof password !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid input"
            });
        }

        const userEmail = email.trim().toLowerCase();

        if (!userEmail || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // 3. Find user in MySQL
        const [users] = await db.execute(
            "SELECT id, name, email, mobile, password FROM users WHERE email = ?",
            [userEmail]
        );

        // 4. Check whether user exists
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        // 5. Compare password with stored hash
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 6. Check JWT configuration
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured");
        }
const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
);
        // 7. Generate JWT token
      res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 1000
});

return res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile
    }
});

    } catch (error) {
        console.error("Login Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Login failed. Please try again."
        });
    }
});



// GET: Protected User Profile
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const [users] = await db.execute(
            `SELECT id, name, email, mobile, created_at
             FROM users
             WHERE id = ?`,
            [req.user.userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            user: users[0]
        });

    } catch (error) {
        console.error("Profile Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch profile"
        });
    }
});



// Logout API
router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
    });

    return res.status(200).json({
        success: true,
        message: "Logout successful"
    });
});


module.exports = router;
