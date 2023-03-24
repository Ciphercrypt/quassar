const express = require('express');
const router = express.Router();

const {addSignal, editSignal,getAllSignals, getSignalById, getSignalByCoordinates}=require('../controllers/SignalController');

router.post('/addSignal', addSignal);
router.post('/editSignal', editSignal);
router.get('/getAllSignals', getAllSignals);
router.get('/getSignalById',getSignalById);
router.get('/getSignalByCoordinates',getSignalByCoordinates);


module.exports = router 