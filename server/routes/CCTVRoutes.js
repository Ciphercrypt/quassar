const express = require('express');
const router = express.Router();
const {addCCTV,getCCTV,getCCTVById,deleteCCTV,editCCTV}=require('../controllers/CCTVController');



router.post('/addCCTV', addCCTV);
router.get('/getCCTVDetails', getCCTV );
router.get('/deleteCCTV',getCCTVById);
router.post('/editCCTVDetails',deleteCCTV);
router.get('/getCCTVBYID',editCCTV);



module.exports = router

