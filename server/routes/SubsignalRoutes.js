const express = require("express");
const router = express.Router();
const {
  createSubsignal,
  updateSubsignal,
  getSubsignalById,
  getAllSubsignalsBySignalAffiliated,
} = require("../controllers/SubsignalController");


router.post("/createSubsignal", createSubsignal);
router.post("/updateSubsignal", updateSubsignal);
router.get("/getSubsignalById", getSubsignalById);
router.get("/getAllSubsignalsBySignalAffiliated", getAllSubsignalsBySignalAffiliated);
