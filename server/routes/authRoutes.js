const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  uploadSignature,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const User = require("../models/User");
const bcrypt = require("bcryptjs");

// =====================
// AUTH ROUTES
// =====================
router.post("/register", registerUser);
router.post("/login", loginUser);

// =====================
// UPLOAD SIGNATURE
// =====================
router.post(
  "/upload-signature",
  protect,
  upload.single("signature"),
  uploadSignature
);

// =====================
// TEST ADMIN ROUTE
// =====================
router.get(
  "/test-admin",
  protect,
  roleMiddleware("admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Admin access granted",
      user: req.user,
    });
  }
);

// =====================
// MAKE ADMIN
// =====================
router.put(
  "/make-admin/:id",
  protect,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role: "admin" },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: "User role updated to admin",
        user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// =====================
// CREATE DRIVER
// =====================
router.post(
  "/create-driver",
  protect,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const { name, email, password, phone } = req.body;

      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Driver already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const driver = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        role: "driver",
      });

      res.json({
        success: true,
        message: "Driver created successfully",
        driver,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// =====================
// GET ALL DRIVERS
// =====================
router.get(
  "/drivers",
  protect,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const drivers = await User.find({ role: "driver" }).select("-password");

      res.json({
        success: true,
        drivers,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// =====================
// GET ALL USERS (NEW ADDED)
// =====================
router.get(
  "/users",
  protect,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const users = await User.find().select("-password");

      res.json({
        success: true,
        users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;