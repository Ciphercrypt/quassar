const express = require('express');
const router = express.Router();


const {getSchedulingScore,getTrafficDataOfSignal,getTrafficDataOfAllSignals} = require('../controllers/SchedulingController');

router.get("/getSchedulingScore", getSchedulingScore);
router.get("/getTrafficDataOfSignal", getTrafficDataOfSignal);
router.get("/getTrafficDataOfAllSignals", getTrafficDataOfAllSignals);


module.exports = router;