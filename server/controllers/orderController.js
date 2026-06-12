const Order = require("../models/Order");
const Vehicle = require("../models/Vehicle");
const User = require("../models/User");

// EMAIL IMPORTS
const sendMail = require("../services/sendMail");
const { orderCreatedTemplate } = require("../templates/emailTemplate");


// =====================
// CREATE ORDER (USER)
// =====================
exports.createOrder = async (req, res) => {
  try {
    const { pickupLocation, deliveryLocation, productName, weight } = req.body;
    console.log("🔥 CREATE ORDER BODY:", req.body);
    console.log("📎 FILE:", req.file);

    if (!pickupLocation || !deliveryLocation || !productName || !weight) {
      return res.status(400).json({
        success: false,
        message: "pickupLocation, deliveryLocation, productName, and weight are required",
      });
    }

    if (isNaN(weight) || Number(weight) <= 0) {
      return res.status(400).json({
        success: false,
        message: "weight must be a positive number",
      });
    }

    const order = await Order.create({
      customer: req.user._id,
      pickupLocation,
      deliveryLocation,
      productName,
      weight: Number(weight),
      signature: req.file ? req.file.path : null,
    });

    console.log("✅ ORDER CREATED:", order._id);

    // =====================
    // EMAIL PART (UNCHANGED)
    // =====================
    const user = await User.findById(req.user._id);

    if (user?.email) {
      await sendMail(
        user.email,
        "🚚 Order Created",
        orderCreatedTemplate(order)
      );
    }

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });

  } catch (error) {
    console.log("❌ CREATE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================
// GET MY ORDERS (USER)
// =====================
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      customer: req.user._id,
    });

    return res.json({
      success: true,
      orders,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer")
      .populate("vehicle")
      .populate("driver");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (req.user.role === "user" && order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (req.user.role === "driver" && order.driver?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return res.json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================
// DRIVER ORDERS (FIXED)
// =====================
exports.getDriverOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      driver: req.user._id,   // ✅ FIXED
    })
      .populate("customer")
      .populate("vehicle");

    return res.json({
      success: true,
      orders,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================
// GET ALL ORDERS (ADMIN)
// =====================
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer")
      .populate("vehicle")
      .populate("driver");

    return res.json({
      success: true,
      orders,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================
// ASSIGN VEHICLE (ADMIN)
// =====================
exports.assignVehicle = async (req, res) => {
  try {
    const { orderId, vehicleId } = req.body;

    const order = await Order.findById(orderId);
    const vehicle = await Vehicle.findById(vehicleId);

    if (!order || !vehicle) {
      return res.status(404).json({ message: "Not found" });
    }

    if (!vehicle.isAvailable) {
      return res.status(400).json({ message: "Vehicle not available" });
    }

    order.vehicle = vehicleId;
    order.status = "assigned";

    vehicle.isAvailable = false;

    await order.save();
    await vehicle.save();

    // 🔥 EMAIL (optional improvement)
    const customer = await User.findById(order.customer);

    if (customer?.email) {
      await sendMail(
        customer.email,
        "🚗 Vehicle Assigned",
        `Your order vehicle has been assigned: ${vehicle.vehicleNumber}`
      );
    }

    return res.json({
      success: true,
      message: "Vehicle assigned",
      order,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================
// ASSIGN DRIVER (ADMIN)
// =====================
exports.assignDriver = async (req, res) => {
  try {
    const { orderId, driverId } = req.body;

    if (!orderId || !driverId) {
      return res.status(400).json({ message: "orderId and driverId are required" });
    }

    const order = await Order.findById(orderId);
    const driver = await User.findById(driverId);

    if (!order || !driver) {
      return res.status(404).json({ message: "Not found" });
    }

    if (driver.role !== "driver") {
      return res.status(400).json({ message: "Assigned user must have driver role" });
    }

    order.driver = driverId;

    await order.save();

    // 🔥 EMAIL
    const customer = await User.findById(order.customer);

    if (customer?.email) {
      await sendMail(
        customer.email,
        "👨‍✈️ Driver Assigned",
        `Driver ${driver.name} assigned to your order`
      );
    }

    return res.json({
      success: true,
      message: "Driver assigned",
      order,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================
// UPDATE ORDER STATUS
// =====================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (req.user.role === "driver" && order.driver?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Drivers can only update their own assigned orders" });
    }

    order.status = status;

    await order.save();

    // 🔥 EMAIL
    const customer = await User.findById(order.customer);

    if (customer?.email) {
      await sendMail(
        customer.email,
        "📦 Order Status Updated",
        `Your order status is now: ${status}`
      );
    }

    return res.json({
      success: true,
      message: "Status updated",
      order,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};