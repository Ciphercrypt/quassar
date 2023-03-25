const VehicleTracking = require("../models/vehicletrack");
const Signal = require("../models/signal");

// Controller function to add a new vehicle tracking record
exports.addVehicleTrack = async (req, res) => {
  const { vehicleID, signalID } = req.body;

  try {
    const vehicleTrack = new VehicleTracking({ vehicleID, signalID });
    const savedTrack = await vehicleTrack.save();
    res.status(201).json(savedTrack);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to delete a vehicle tracking record
exports.deleteVehicleTrack = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTrack = await VehicleTracking.findByIdAndDelete(id);
    if (!deletedTrack) {
      return res
        .status(404)
        .json({ message: "Vehicle tracking record not found" });
    }
    res.json({ message: "Vehicle tracking record deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to get vehicle tracking records by date and time
exports.getVehicleTrackByDate = async (req, res) => {
  const { timestamp } = req.params;

  try {
    const vehicleTracks = await VehicleTracking.find({
      timestamp: { $gte: timestamp },
    });
    res.json(vehicleTracks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

async function getSignalCoordinates(signalId) {
  const signal = await Signal.findOne({ ID: signalId });
  return signal["coordinates"];
}

exports.getVehicleTrackLocation = async (req, res) => {
  console.log("Rec : ", req.body);
  const { vehicleID } = req.body;

  try {
    const vehicleTracks = await VehicleTracking.find({ vehicleID: vehicleID });

    let prev = await getSignalCoordinates(vehicleTracks[0].signalID);
    let co = [];
    let li = [];
    let len = vehicleTracks.length;
    for (let i = 1; i < len; i++) {
      let cu_co = await getSignalCoordinates(vehicleTracks[i].signalID);
      co.push([prev, cu_co]);
      prev = cu_co;
    }

    res.json(co);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
