const express = require("express");
const router = express.Router();

const {
  addVehicleTrack,
  deleteVehicleTrack,
  getVehicleTrackByDate,
  getVehicleTrackLocation,
} = require("../controllers/VehicleTrackingController");
router.post("/addVehicleTrack", addVehicleTrack);
router.post("/deleteVehicleTrack", deleteVehicleTrack);
router.get("/getVehicleTrackByDate", getVehicleTrackByDate);
router.post("/getVehicleTrackLocation", getVehicleTrackLocation);

module.exports = router;
