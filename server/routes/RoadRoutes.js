const express = require('express');
const router = express.Router();
const {createRoad,editRoad,deleteRoad,fetchRoad,fetchRoadByEndingPoint}=require('../controllers/RoadController');



router.post('/addRoadDetails', createRoad);
router.get('/getRoadDetails', fetchRoad );
router.get('/deleteRoad',deleteRoad);
router.post('/editRoadDetails',editRoad);
router.get('/getRoadByEndingPoint',fetchRoadByEndingPoint);



module.exports = router

