const express = require("express");
const router = express.Router();

const {
  addVehicle,
  getVehicles,
} = require("../controllers/vehicleController");

const { protect } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Admin only add vehicle
router.post("/", protect, roleMiddleware("admin"), addVehicle);

// Get vehicles
router.get("/", protect, getVehicles);

module.exports = router;