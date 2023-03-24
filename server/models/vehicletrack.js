const mongoose = require('mongoose');

const vehicleTrackingSchema = new mongoose.Schema({

    
  vehicleID: {
    type: String,
    required: true
  },
  signalID: {
    type: String,
    required: true
},
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  }
});

vehicleTrackingSchema.index({ location: '2dsphere' });

const VehicleTracking = mongoose.model('VehicleTracking', vehicleTrackingSchema);

module.exports = VehicleTracking;
