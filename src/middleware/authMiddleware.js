const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const logger = require("../utils/logger");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Ensure tenantId is attached correctly
    req.user = { id: user._id, tenantId: decoded.tenantId };
    console.log("Authenticated User:", req.user);
    next();
  } catch (error) {
    logger.error("Authentication error", { error: error.message });
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
