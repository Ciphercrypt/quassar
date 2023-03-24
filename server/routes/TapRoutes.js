const express = require('express');
const router = express.Router();
const {addTapDetails,getTapDetails,getAllTapDetails,getStatusofWater}=require('../controllers/tapController');



router.post('/addTapDetails', addTapDetails);
router.get('/getTapDetails', getTapDetails );
router.get('/getAllTapDetails',getAllTapDetails);
router.get('/getStatusofWater',getStatusofWater);


module.exports = router