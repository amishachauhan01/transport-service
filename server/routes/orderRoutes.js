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
  getOrderById,
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
const validate = require("../middleware/validateMiddleware");
const {
  createOrderValidator,
  assignVehicleValidator,
  assignDriverValidator,
  updateOrderStatusValidator,
  orderIdParamValidator,
} = require("./orderValidators");

router.post(
  "/",
  protect,
  roleMiddleware("user", "admin"),
  upload.single("signature"),
  createOrderValidator,
  validate,
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
// ORDER BY ID
// =====================
router.get(
  "/:id",
  protect,
  roleMiddleware("admin", "user", "driver"),
  orderIdParamValidator,
  validate,
  getOrderById
);


// =====================
// ASSIGN VEHICLE (ADMIN)
// =====================
router.put(
  "/assign-vehicle",
  protect,
  roleMiddleware("admin"),
  assignVehicleValidator,
  validate,
  assignVehicle
);


// =====================
// ASSIGN DRIVER (ADMIN)
// =====================
router.put(
  "/assign-driver",
  protect,
  roleMiddleware("admin"),
  assignDriverValidator,
  validate,
  assignDriver
);


// =====================
// UPDATE ORDER STATUS
// =====================
router.put(
  "/update-status",
  protect,
  roleMiddleware("admin", "driver"),
  updateOrderStatusValidator,
  validate,
  updateOrderStatus
);


// =====================
// INVOICE DOWNLOAD
// =====================
router.get(
  "/invoice/:id",
  protect,
  roleMiddleware("admin", "user"),
  orderIdParamValidator,
  validate,
  downloadInvoice
);

module.exports = router;