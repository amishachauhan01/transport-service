const Vehicle = require("../models/Vehicle");

// Add Vehicle
exports.addVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);

    res.json({
      success: true,
      message: "Vehicle added successfully",
      vehicle,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all vehicles
exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate("driver");

    res.json({
      success: true,
      vehicles,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};