const express = require("express");
const { leavePage, leaveHistory, leave } = require("../controlllers/leave");
const { createEmployee, permission, createPermission, permissionHistory, history, dashboard, leaveDetails, settings, UpdatePassword, permissionDetails, reportsFilter,filterLeavesHistoryByStatus,filterPermissionsHistoryByStatus } = require("../controlllers/employee");
const { logIn } = require("../controlllers/login");

const router = express.Router();



router.get('/leave',leave);
router.post('/login',logIn);
router.get('/leave-history',leaveHistory);
router.post('/filter',leaveHistory)
router.get('/permission',permission);
router.post('/createpermission',createPermission);
router.get('/permission-history',permissionHistory);
router.post('/filter-permission',permissionHistory);
//router.get('/',history);
//router.post('/',history)
router.get('/dashboard',dashboard);
router.get('/leave-details',leaveDetails);
router.get('/settings',settings);
router.post('/updatepassword',UpdatePassword);

router.get('/permission-details',permissionDetails);
router.post('/reports-filter',reportsFilter);
router.get('/leaves-status',filterLeavesHistoryByStatus);
router.get('/permission-status',filterPermissionsHistoryByStatus);





module.exports = router;
