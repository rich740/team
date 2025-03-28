const db = require("../models");
const { Op } = require('sequelize');
const Employees = db.Employees;

// Create a new employee
exports.createEmployee = async (req, res) => {
  const { name, skill, cost } = req.body;

  // Validate input fields
  if (!name) {
    return res.status(400).json({ 
      success: false,
      message: "Employee name is required" 
    });
  }

  // Validate skill and cost
  if (!skill) {
    return res.status(400).json({ 
      success: false,
      message: "Employee skill is required" 
    });
  }

  // Ensure cost is a valid number
  const parsedCost = parseFloat(cost);
  if (isNaN(parsedCost) || parsedCost < 0) {
    return res.status(400).json({ 
      success: false,
      message: "Invalid cost. Must be a non-negative number" 
    });
  }

  try {
    // Case-insensitive check for existing employee
    const existingEmployee = await Employees.findOne({ 
      where: { 
        name: {
          [Op.like]: name.trim() 
        } 
      } 
    });

    if (existingEmployee) {
      return res.status(400).json({ 
        success: false,
        message: `Employee "${name}" already exists` 
      });
    }

    // Create new employee
    const newEmployee = await Employees.create({ 
      name: name.trim(), 
      skill: skill.trim(), 
      cost: parsedCost 
    });

    // Return success response with created employee
    res.status(201).json({ 
      success: true,
      message: "Employee added successfully", 
      employee: {
        id: newEmployee.id,
        name: newEmployee.name,
        skill: newEmployee.skill,
        cost: newEmployee.cost
      }
    });

  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal Server Error", 
      errorDetails: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    // Fetch all employees with error handling
    const employees = await Employees.findAll({
      attributes: ['id', 'name', 'skill', 'cost', 'teamId'], // Specify exact fields
      order: [['createdAt', 'DESC']] // Optional: sort by most recent
    });

    // Handle empty result set
    if (!employees || employees.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No employees found",
        employees: [],
        count: 0
      });
    }

    // Return successful response
    res.status(200).json({
      success: true,
      message: "Employees retrieved successfully",
      employees: employees,
      count: employees.length
    });

  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal Server Error",
      errorDetails: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Employee ID is required"
    });
  }

  try {
    // Check if employee exists before deletion
    const employeeToDelete = await Employees.findByPk(id);

    if (!employeeToDelete) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Perform deletion
    const deletedCount = await Employees.destroy({
      where: { id: id }
    });

    // Confirm deletion
    if (deletedCount > 0) {
      res.status(200).json({
        success: true,
        message: 'Employee deleted successfully',
        deletedEmployee: {
          id: employeeToDelete.id,
          name: employeeToDelete.name
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to delete employee'
      });
    }

  } catch (error) {
    console.error('Backend: Employee deletion error', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting employee',
      errorDetails: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update employee's team
exports.updateEmployeeTeam = async (req, res) => {
  const { id } = req.params;
  const { teamId } = req.body;

  // Validate input
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Employee ID is required"
    });
  }

  try {
    // Find the employee
    const employee = await Employees.findByPk(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Update the team
    const updatedEmployee = await employee.update({
      teamId: teamId || null // Allow setting to null (unassigned)
    });

    res.status(200).json({
      success: true,
      message: 'Employee team updated successfully',
      employee: {
        id: updatedEmployee.id,
        name: updatedEmployee.name,
        teamId: updatedEmployee.teamId
      }
    });

  } catch (error) {
    console.error('Error updating employee team:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating employee team',
      errorDetails: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};