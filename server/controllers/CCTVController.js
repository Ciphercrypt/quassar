const CCTVCamera = require('../models/cctv');

// Add a new CCTV camera
exports.addCCTV = async (req, res) => {
  try {
    const { id, direction, roadId, signalId, videoFeedUrl } = req.body;
    const newCCTV = new CCTVCamera({
      id,
      direction,
      road: roadId,
      signal: signalId,
      videoFeedUrl
    });
    await newCCTV.save();
    res.status(201).json({ message: 'CCTV camera added successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while adding CCTV camera.' });
  }
};

// Edit an existing CCTV camera
exports.editCCTV = async (req, res) => {
  try {
    const { id, direction, roadId, signalId, videoFeedUrl } = req.body;
    const cctv = await CCTVCamera.findById(req.params.id);
    if (!cctv) {
      return res.status(404).json({ message: 'CCTV camera not found.' });
    }
    cctv.id = id;
    cctv.direction = direction;
    cctv.road = roadId;
    cctv.signal = signalId;
    cctv.videoFeedUrl = videoFeedUrl;
    await cctv.save();
    res.status(200).json({ message: 'CCTV camera edited successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while editing CCTV camera.' });
  }
};

// Delete an existing CCTV camera
exports.deleteCCTV = async (req, res) => {
  try {
    const cctv = await CCTVCamera.findById(req.params.id);
    if (!cctv) {
      return res.status(404).json({ message: 'CCTV camera not found.' });
    }
    await cctv.remove();
    res.status(200).json({ message: 'CCTV camera deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting CCTV camera.' });
  }
};

// Retrieve all CCTV cameras
exports.getCCTV = async (req, res) => {
  try {
    const cctvs = await CCTVCamera.find().populate('road').populate('signal');
    res.status(200).json(cctvs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while retrieving CCTV cameras.' });
  }
};

exports.getCCTVById = async (req, res) => {
    try {
      const cctvCamera = await CCTVCamera.findById(req.params.id).populate('road').populate('signal');
      if (!cctvCamera) {
        return res.status(404).json({ message: 'CCTV camera not found' });
      }
      res.json(cctvCamera);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  
