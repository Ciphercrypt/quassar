const mongoose = require('mongoose');




const signalSchema = new mongoose.Schema({
  ID: {
    type: String,
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  },
  location: {
    type: String,
    required: true
  }
});

const Signal = mongoose.model('Signal', signalSchema);

module.exports = Signal;
