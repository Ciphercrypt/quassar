// Import the Signal model
const Signal = require('../models/signal');

// Controller to add a new signal
const addSignal = async (req, res) => {
  try {
    const { ID, coordinates, location } = req.body;

    // Create a new Signal instance
    const signal = new Signal({
      ID,
      coordinates,
      location,
    });

    // Save the new signal to the database
    const result = await signal.save();

    res.status(201).json({
      success: true,
      message: 'Signal added successfully!',
      signal: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Controller to edit an existing signal
const editSignal = async (req, res) => {
  try {
    const { id } = req.params;
    const { coordinates, location } = req.body;

    // Find the signal in the database by ID
    const signal = await Signal.findById(id);

    if (!signal) {
      return res
        .status(404)
        .json({ success: false, message: 'Signal not found' });
    }

    // Update the signal's coordinates and location
    signal.coordinates = coordinates;
    signal.location = location;

    // Save the updated signal to the database
    const result = await signal.save();

    res.status(200).json({
      success: true,
      message: 'Signal updated successfully!',
      signal: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


const getAllSignals = async (req, res) => {
    try {
     
  
      // Find the signal in the database by ID
      const signal = await Signal.find();
  
      if (!signal) {
        return res
          .status(404)
          .json({ success: false, message: 'Signal not found' });
      }
  
      res.status(200).json({
        success: true,
        signal,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };



// Controller to get a signal by ID
const getSignalById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the signal in the database by ID
    const signal = await Signal.findById(id);

    if (!signal) {
      return res
        .status(404)
        .json({ success: false, message: 'Signal not found' });
    }

    res.status(200).json({
      success: true,
      signal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Controller to get a signal by coordinates
const getSignalByCoordinates = async (req, res) => {
  try {
    const { xcord, ycord } = req.params;

    // Find the signal in the database by coordinates
    const signal = await Signal.findOne({ coordinates: { xcord, ycord } });

    if (!signal) {
      return res
        .status(404)
        .json({ success: false, message: 'Signal not found' });
    }

    res.status(200).json({
      success: true,
      signal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { addSignal, editSignal,getAllSignals, getSignalById, getSignalByCoordinates };
