const mongoose = require('mongoose');

const vehicleCountSchema = new mongoose.Schema({
  subsignalID: {
    type: String,
    required: true
  },
  CCTVID: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  }
});

const VehicleCount = mongoose.model('VehicleCount', vehicleCountSchema);

module.exports = VehicleCount;
