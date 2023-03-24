const mongoose = require('mongoose');

const coordinateSchema = new mongoose.Schema({
    lat: { type: Number, required: true },
    long: { type: Number, required: true },
    direction: { type: String, enum: ['left', 'right'] }, // direction field with left or right values
  });

const roadSchema = new mongoose.Schema({
  id: { type: String, required: true },
  startingCoordinates: { type: coordinateSchema, required: true },
  endingCoordinates: { type: coordinateSchema, required: true },
  coordinates: [{ type: coordinateSchema, required: true }],
});

const Road = mongoose.model('Road', roadSchema);

module.exports = Road;
