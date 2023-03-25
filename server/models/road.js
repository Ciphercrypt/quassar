const mongoose = require('mongoose');



const roadSchema = new mongoose.Schema({
  id: { type: String, required: true },
  startingSignalID:{type:String},
  endingSignalID:{type:String},
  startingCoordinates: [{ type: Number, required: true }],
  endingCoordinates:  [{ type: Number, required: true }],
  coordinates: [[Number, Number]],
});

const Road = mongoose.model('Road', roadSchema);

module.exports = Road;
