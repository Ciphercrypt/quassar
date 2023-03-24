const SubSignal = require('../models/subsignal');

// Create a new subsignal
const createSubsignal = async (req, res) => {
  try {
    const { signalAffiliated, CCTVAffiliated } = req.body;
    const lastSubsignal = await SubSignal.findOne().sort({ ID: -1 }).limit(1);
    const newID = lastSubsignal ? parseInt(lastSubsignal.ID) + 15 : 15;
    const newSubsignal = new SubSignal({
      ID: newID.toString(),
      signalAffiliated,
      CCTVAffiliated,
    });
    const savedSubsignal = await newSubsignal.save();
    res.status(201).json(savedSubsignal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update an existing subsignal by ID
const updateSubsignal = async (req, res) => {
  try {
    const { signalAffiliated, CCTVAffiliated } = req.body;
    const updatedSubsignal = await SubSignal.findByIdAndUpdate(
      req.params.id,
      { signalAffiliated, CCTVAffiliated },
      { new: true }
    );
    if (!updatedSubsignal) {
      return res.status(404).json({ message: 'Subsignal not found' });
    }
    res.json(updatedSubsignal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a subsignal by ID
const getSubsignalById = async (req, res) => {
  try {
    const subsignal = await SubSignal.findById(req.params.id);
    if (!subsignal) {
      return res.status(404).json({ message: 'Subsignal not found' });
    }
    res.json(subsignal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all subsignals affiliated with a given signal
const getAllSubsignalsBySignalAffiliated = async (req, res) => {
  try {
    const subsignals = await SubSignal.find({
      signalAffiliated: req.params.signalID,
    });
    res.json(subsignals);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createSubsignal,
  updateSubsignal,
  getSubsignalById,
  getAllSubsignalsBySignalAffiliated,
};
