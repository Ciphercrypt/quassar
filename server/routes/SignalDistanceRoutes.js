const express = require('express');
const router = express.Router();

const { createSignalDistance,getAllSignalDistances,getSignalDistanceById,updateSignalDistanceById,deleteSignalDistanceById,getSignalDistanceBySourceAndDest,getAllSignalDistancesBySourceSignal,getAllSignalDistancesByDestSignal } =require('../controllers/SignalDistanceController');


router.post('/addSignalDistance', createSignalDistance);
router.get('/getAllSignalDistances', getAllSignalDistances );
router.get('/getSignalDistanceById',getSignalDistanceById);
router.post('/updateSignalDistanceById',updateSignalDistanceById);
router.get('/deleteSignalDistanceById',deleteSignalDistanceById);
router.get('/getSignalDistanceBySourceAndDest',getSignalDistanceBySourceAndDest);
router.get('/getAllSignalDistancesBySourceSignal',getAllSignalDistancesBySourceSignal);
router.get('/getAllSignalDistancesByDestSignal',getAllSignalDistancesByDestSignal);

module.exports = router