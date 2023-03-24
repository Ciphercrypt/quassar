const mongoose = require('mongoose');

const signalDistanceSchema = new mongoose.Schema({
  sourceSignalID: { type: String, required: true },
  destSignalID: { type: String, required: true },
  expectedTime: { type: Number, required: true },
  distance:{type:String,required:true},
  direction: { type: String, required: true }
});

const SignalDistance = mongoose.model('SignalDistance', signalDistanceSchema);

module.exports = SignalDistance;
