const mongoose = require('mongoose');

const cctvCameraSchema = new mongoose.Schema({
  id: { type: String, required: true },
  direction: { type: String, required: true },
  road: { type: String, required: true },
  signal: { type: String, required: true },
  videoFeedUrl: { type: String, required: true },
});

const CCTVCamera = mongoose.model('CCTVCamera', cctvCameraSchema);

module.exports = CCTVCamera;
