const Order = require("../models/Order");

// =====================
// GET REPORTS
// =====================
exports.getReports = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      status: "pending",
    });

    const assignedOrders = await Order.countDocuments({
      status: "assigned",
    });

    const deliveredOrders = await Order.countDocuments({
      status: "delivered",
    });

    res.json({
      success: true,
      reports: {
        totalOrders,
        pendingOrders,
        assignedOrders,
        deliveredOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};