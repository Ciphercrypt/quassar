const express = require("express");
const router = express.Router();

const {
  addVehicleCount,
  getVehicleCount,
  getVehicleCountByDate,
  getVehicleCountByCameraID,
  getVehicleCountBySignalID
} = require('../controllers/VehicleCountController');


router.post("/addVehicleCount", addVehicleCount);
router.get("/getVehicleCount", getVehicleCount);
router.get("/getVehicleCountByDate", getVehicleCountByDate);
router.get("/getVehicleCountByCameraID", getVehicleCountByCameraID);
router.get('/getVehicleCountBySignalID',getVehicleCountBySignalID);



module.exports = router