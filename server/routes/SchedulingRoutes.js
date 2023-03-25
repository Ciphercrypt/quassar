const express = require('express');
const router = express.Router();


const {getSchedulingScore} = require('../controllers/SchedulingController');

router.get("/getSchedulingScore", getSchedulingScore);

module.exports = router;