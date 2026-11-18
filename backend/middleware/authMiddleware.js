
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        // Get JWT token from HttpOnly Cookie
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token required"
            });
        }

        // Verify JWT token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store authenticated user ID
        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;
