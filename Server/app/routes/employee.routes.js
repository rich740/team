const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");

// Route to create an employee
router.post("/employees", employeeController.createEmployee);
router.delete('/deleteemployees/:id', employeeController.deleteEmployee);
router.get('/getemployees', employeeController.getAllEmployees);
router.put('/updateemployees', employeeController.updateEmployeeTeam);

module.exports = router;
