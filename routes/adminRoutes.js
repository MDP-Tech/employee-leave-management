const express = require("express");
const { adminLoginPage, dashboard, pendingHistoryPage, approveHistoryPage, declinedHistory, leaveHistory, leavesHistory, department, adminCalender, getDetailsByAdmin, reports,filterLeaveHistoryByStatus ,filterPermissionHistoryByStatus,permissionReports, permissionFilter} = require("../controlllers/login");
const { employees, employeeLeavedetails, leaveSection,getEmployeesList, employeeDetails, filterDetailsByStatus } = require("../controlllers/leave");
const { addNewEmployee, manageAdmin, createEmployee, getReportsPage, adminReportsFilter,getEmployess,history,employeesDeletedList } = require("../controlllers/employee");

const router = express.Router();

 router.post("/login",adminLoginPage);
router.get("/dashboard",dashboard);
router.get("/pending-history",pendingHistoryPage);
router.get("/approved-history",approveHistoryPage);
router.get("/declined-history",declinedHistory);
router.get("/leaves-history",leavesHistory);
router.post('/filter-leaves',leavesHistory);
router.get('/leaves-status',filterLeaveHistoryByStatus);
router.get('/admin-calender',adminCalender);
router.get('/getDetailsByAdmin',getDetailsByAdmin);
router.get('/AddNewEmployee',addNewEmployee);
router.get('/permissions-status',filterPermissionHistoryByStatus);
router.get('/permission-history',history);
router.post('/permission-history',history);





router.get("/employees",employees);
router.get("/add-employee",addNewEmployee);
router.get("/employeeLeave-details",employeeLeavedetails);
router.post("/create-employee",createEmployee)
// router.get("/leadDetails/:lead_id", getDetailsById);
router.get('/reports',getReportsPage);
router.post('/reports-filter',adminReportsFilter);
router.get('/employees-list',getEmployess);
router.get('/employees-deleted-list',employeesDeletedList);
router.get('/permission-reports',permissionReports);
router.post('/permission-filter',permissionFilter);
router.get('/employee-details',employeeDetails);
router.post('/filter-details',filterDetailsByStatus)










module.exports = router;
