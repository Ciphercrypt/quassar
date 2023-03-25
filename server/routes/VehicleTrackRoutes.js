const express = require("express");
const router = express.Router();

const {
  addVehicleTrack,
  deleteVehicleTrack,
  getVehicleTrackByDate,
} = require("../controllers/VehicleTrackingController");
router.post("/addVehicleTrack", addVehicleTrack);
router.post("/deleteVehicleTrack", deleteVehicleTrack);
router.get("/getVehicleTrackByDate", getVehicleTrackByDate);

module.exports = router;
