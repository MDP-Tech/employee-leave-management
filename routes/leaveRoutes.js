const express = require("express");
const { createLeave, updateLeaveStatus, uploadFile, remainder, deleteLeave } = require("../controlllers/leave");

const router = express.Router();


router.post('/createLeave',createLeave);
router.post('/uploadFile',uploadFile);

router.post('/updateLeaveStatus',updateLeaveStatus);
router.post('/set-remainder',remainder)
router.post('/deleteLeave',deleteLeave);




module.exports = router;