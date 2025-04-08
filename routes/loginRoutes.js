const express = require("express");

const router = express.Router();
const axios = require("axios");
const { loginPage, loginPage1, leaveHistoryPage, adminLoginPage, logOut, calender, reports, getdetails, calender1, adminProfile ,createNewPassword, deleteEmployee, updateEmployee,getTemplate} = require("../controlllers/login");
const { passwordMail } = require("../controlllers/leave");


router.get("/",loginPage);
// router.get("/leave-history",leaveHistoryPage);
// router.get("/login",adminLoginPage);
router.get('/logout',logOut);
router.get('/calender',calender);
router.get('/reports',reports);
router.get('/getdeatils',getdetails);
router.get('/get-calender1',calender1);
router.get('/admin-profile',adminProfile);
router.post('/send-template',passwordMail);
// router.get('/create-new-password',createNewPassword);
router.post('/delete-employees',deleteEmployee);
router.post('/edit-employee',updateEmployee);
router.get('/account-security/reset-password',getTemplate)


router.get('/create-new-password/:id/:token',createNewPassword);


module.exports = router;
