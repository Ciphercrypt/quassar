const SignalDistance = require('../models/signaldistances');


const createSignalDistance = async (req, res) => {
  try {
    const signalDistance = new SignalDistance(req.body);
    const newSignalDistance = await signalDistance.save();
    res.status(201).json(newSignalDistance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


const getAllSignalDistances = async (req, res) => {
    try {
      const signalDistances = await SignalDistance.find();
      res.json(signalDistances);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };



  const getSignalDistanceById = async (req, res) => {
    try {
      const signalDistance = await SignalDistance.findById(req.params.id);
      if (!signalDistance) {
        return res.status(404).json({ message: 'Signal distance not found' });
      }
      res.json(signalDistance);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };




  const updateSignalDistanceById = async (req, res) => {
  try {
    const signalDistance = await SignalDistance.findById(req.params.id);
    if (!signalDistance) {
      return res.status(404).json({ message: 'Signal distance not found' });
    }
    Object.assign(signalDistance, req.body);
    const updatedSignalDistance = await signalDistance.save();
    res.json(updatedSignalDistance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



const deleteSignalDistanceById = async (req, res) => {
    try {
      const signalDistance = await SignalDistance.findById(req.params.id);
      if (!signalDistance) {
        return res.status(404).json({ message: 'Signal distance not found' });
      }
      await signalDistance.remove();
      res.json({ message: 'Signal distance deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  const getSignalDistanceBySourceAndDest = async (sourceSignalID, destSignalID) => {
    try {
      const signalDistance = await SignalDistance.findOne({ sourceSignalID, destSignalID });
      if (!signalDistance) {
        throw new Error('Signal distance not found');
      }
      return signalDistance;
    } catch (error) {
      throw new Error(`Error while getting signal distance: ${error.message}`);
    }
  };


  const getAllSignalDistancesBySourceSignal = async (req, res) => {
    try {
      const sourceSignal = req.params.sourceSignal;
      const signalDistances = await SignalDistance.find({ sourceSignal: { $regex: sourceSignal, $options: 'i' } });
      if (!signalDistances) {
        return res.status(404).json({ message: 'Signal distances not found' });
      }
      res.json(signalDistances);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  const getAllSignalDistancesByDestSignal = async (req, res) => {
    try {
      const DestSignal = req.params.destinationSignal;
      const signalDistances = await SignalDistance.find({ destSignalID: { $regex: DestSignal, $options: 'i' } });
      if (!signalDistances) {
        return res.status(404).json({ message: 'Signal distances not found' });
      }
      res.json(signalDistances);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };


module.exports = {createSignalDistance,getAllSignalDistances,getSignalDistanceById,updateSignalDistanceById,deleteSignalDistanceById,getSignalDistanceBySourceAndDest,getAllSignalDistancesBySourceSignal,getAllSignalDistancesByDestSignal};