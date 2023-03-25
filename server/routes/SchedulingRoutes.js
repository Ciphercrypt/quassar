const express = require('express');
const router = express.Router();


const {getSchedulingScore,getTrafficDataOfSignal} = require('../controllers/SchedulingController');

router.get("/getSchedulingScore", getSchedulingScore);
router.get("/getTrafficDataOfSignal", getTrafficDataOfSignal);


module.exports = router;