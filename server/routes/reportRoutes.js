const express = require("express");
const router = express.Router();

const { getReports } = require("../controllers/reportController");

const { protect } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ADMIN ONLY
router.get(
  "/",
  protect,
  roleMiddleware("admin"),
  getReports
);

module.exports = router;