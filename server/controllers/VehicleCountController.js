const VehicleCount = require("../models/vehiclecount");

// Add vehicle count for a specific signalID, CCTVID, and timestamp
const addVehicleCount = async (req, res) => {
  try {
    const { signalID, CCTVID, vehicleCount, timestamp } = req.body;
    const newVehicleCount = new VehicleCount({
      signalID,
      CCTVID,
      vehicleCount,
      timestamp,
    });
    await newVehicleCount.save();
    res.status(201).json(newVehicleCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all vehicle counts
const getVehicleCount = async (req, res) => {
  try {
    const vehicleCounts = await VehicleCount.find();
    res.json(vehicleCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get vehicle counts after a given date and time
const getVehicleCountByDate = async (req, res) => {
  try {
    const { timestamp } = req.query;
    const vehicleCounts = await VehicleCount.find({
      timestamp: { $gte: new Date(timestamp) },
    });
    res.json(vehicleCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getVehicleCountBySignalID = async (req, res) => {
  try {
    const { signalID } = req.params;
    const vehicleCounts = await VehicleCount.find({ signalID });
    res.status(200).json(vehicleCounts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting vehicle counts" });
  }
};

// Controller to get vehicle count records by camera ID
const getVehicleCountByCameraID = async (req, res) => {
  try {
    const { cameraID } = req.params;
    const vehicleCounts = await VehicleCount.find({ CCTVID: cameraID });
    res.status(200).json(vehicleCounts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting vehicle counts" });
  }
};

module.exports = {
  addVehicleCount,
  getVehicleCount,
  getVehicleCountByDate,
  getVehicleCountBySignalID,
  getVehicleCountByCameraID,
};
