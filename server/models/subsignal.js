const mongoose = require('mongoose');

const subsignalSchema = new mongoose.Schema({
  ID: {
    type: String,
    required: true,
    unique: true,
  },
  signalAffiliated: {
    type: String,
    required: true,
  },
  CCTVAffiliated: {
    type: String,
   
    required: true,
  },
  previousSubSignal: {
    type:String,
  },
});

module.exports = mongoose.model('SubSignal', subsignalSchema);
