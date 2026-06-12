const { body, param } = require("express-validator");

exports.createOrderValidator = [
  body("pickupLocation").notEmpty().withMessage("Pickup location is required"),
  body("deliveryLocation").notEmpty().withMessage("Delivery location is required"),
  body("productName").notEmpty().withMessage("Product name is required"),
  body("weight")
    .notEmpty()
    .withMessage("Weight is required")
    .isFloat({ gt: 0 })
    .withMessage("Weight must be a positive number"),
];

exports.assignVehicleValidator = [
  body("orderId").notEmpty().withMessage("Order ID is required"),
  body("vehicleId").notEmpty().withMessage("Vehicle ID is required"),
];

exports.assignDriverValidator = [
  body("orderId").notEmpty().withMessage("Order ID is required"),
  body("driverId").notEmpty().withMessage("Driver ID is required"),
];

exports.updateOrderStatusValidator = [
  body("orderId").notEmpty().withMessage("Order ID is required"),
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "assigned", "picked", "on_the_way", "delivered"])
    .withMessage("Status must be a valid value"),
];

exports.orderIdParamValidator = [
  param("id").notEmpty().withMessage("Order ID is required"),
];
