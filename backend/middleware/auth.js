// backend\middleware\auth.js
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("Auth Middleware - Token:", token);
  if (!token) {
    console.log("Auth Middleware - No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    console.log("Auth Middleware - Decoded Token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth Middleware - Invalid token:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;