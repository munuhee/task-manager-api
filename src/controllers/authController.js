const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { registerValidation, loginValidation } = require("../utils/validate");
const logger = require("../utils/logger");
const { v4: uuidv4 } = require("uuid");

const registerUser = async (req, res) => {
  try {
    const { error } = registerValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const tenantId = uuidv4(); // Generate a unique tenantId
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      tenantId,
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, tenantId: user.tenantId },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.status(201).json({ token }); // Set status code to 201
  } catch (error) {
    console.error("Registration error:", error); // Enhanced logging
    logger.error("Registration error", { error: error.message });
    res.status(500).json({ message: "Internal server error" });
  }
};

const authenticateUser = async (req, res) => {
  try {
    const { error } = loginValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, tenantId: user.tenantId },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.status(200).json({ token }); // Set status code to 200
  } catch (error) {
    console.error("Authentication error:", error); // Enhanced logging
    logger.error("Authentication error", { error: error.message });
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  authenticateUser,
};
