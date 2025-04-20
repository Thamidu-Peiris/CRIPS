// backend\middleware\isSystemManager.js
const isSystemManager = (req, res, next) => {
    console.log("isSystemManager Middleware - User:", req.user);
    if (!req.user || req.user.role?.toLowerCase() !== "systemmanager") {
      console.log("isSystemManager Middleware - Access denied: User role is not SystemManager");
      return res.status(403).json({ message: "Access denied. System Manager role required." });
    }
    console.log("isSystemManager Middleware - Access granted: User is SystemManager");
    next();
  };
  
  module.exports = isSystemManager;