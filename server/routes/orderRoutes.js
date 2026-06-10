const express = require("express");
const router = express.Router();

// Controllers
const {
  createOrder,
  getOrders,
  assignVehicle,
  assignDriver,
  updateOrderStatus,
  getMyOrders,
  getDriverOrders,
} = require("../controllers/orderController");

const { downloadInvoice } = require("../controllers/pdfController");

// Middleware
const { protect } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");


// =====================
// CREATE ORDER (USER / ADMIN)
// + SIGNATURE UPLOAD
// =====================
router.post(
  "/",
  protect,
  roleMiddleware("user", "admin"),
  upload.single("signature"),
  createOrder
);


// =====================
// GET ALL ORDERS (ADMIN)
// =====================
router.get(
  "/",
  protect,
  roleMiddleware("admin"),
  getOrders
);


// =====================
// MY ORDERS (USER)
// =====================
router.get(
  "/my-orders",
  protect,
  roleMiddleware("user", "admin"),
  getMyOrders
);


// =====================
// DRIVER ORDERS
// =====================
router.get(
  "/driver-orders",
  protect,
  roleMiddleware("driver"),
  getDriverOrders
);


// =====================
// ASSIGN VEHICLE (ADMIN)
// =====================
router.put(
  "/assign-vehicle",
  protect,
  roleMiddleware("admin"),
  assignVehicle
);


// =====================
// ASSIGN DRIVER (ADMIN)
// =====================
router.put(
  "/assign-driver",
  protect,
  roleMiddleware("admin"),
  assignDriver
);


// =====================
// UPDATE ORDER STATUS
// =====================
router.put(
  "/update-status",
  protect,
  roleMiddleware("admin", "driver"),
  updateOrderStatus
);


// =====================
// INVOICE DOWNLOAD
// =====================
router.get(
  "/invoice/:id",
  protect,
  roleMiddleware("admin", "user"),
  downloadInvoice
);

module.exports = router;