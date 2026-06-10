const Order = require("../models/Order");
const generatePdf = require("../services/generatePdf");

exports.downloadInvoice = async (req, res) => {
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

    generatePdf(order, res);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};