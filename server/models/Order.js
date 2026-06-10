const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
{
customer: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true,
},

pickupLocation: {
  type: String,
  required: true,
},

deliveryLocation: {
  type: String,
  required: true,
},

productName: {
  type: String,
  required: true,
},

weight: {
  type: Number,
  required: true,
},

vehicle: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Vehicle",
  default: null,
},

driver: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
},

status: {
  type: String,
  enum: [
    "pending",
    "assigned",
    "picked",
    "on_the_way",
    "delivered",
  ],
  default: "pending",
},

receiverName: {
  type: String,
  default: "",
},

receiverPhone: {
  type: String,
  default: "",
},

deliveryNote: {
  type: String,
  default: "",
},

},
{
timestamps: true,
}
);

module.exports = mongoose.model("Order", orderSchema);
