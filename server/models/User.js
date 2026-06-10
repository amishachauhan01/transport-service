const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
  },

  role: {
    type: String,
    enum: ["admin", "user", "driver"],
    default: "user",
  },

  licenseNumber: {
    type: String,
  },

  vehicleAssigned: {
    type: String,
  },
  signature: {
  type: String,
},
});

module.exports = mongoose.model("User", userSchema);