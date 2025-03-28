const db = require("../models");
const Employees = db.Employees;

// Create a new employee
exports.createEmployee = async (req, res) => {
  const { name, skill, cost } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Employee name is required" });
  }

  try {
    // Check if employee already exists
    const existingEmployee = await Employees.findOne({ where: { name } });
    if (existingEmployee) {
      return res.status(400).json({ message: "Employee already exists" });
    }

    // Create new employee
    const newEmployee = await Employees.create({ name, skill, cost });

    res.status(201).json({ message: "Employee added successfully", newEmployee });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteEmployee = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find the employee by ID
      const employee = await Employees.findByPk(id);
  
      // If employee not found, return 404
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
  
      // Delete the employee
      await employee.destroy();
  
      // Send success response
      res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
      console.error("Error deleting employee:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  console.log("Full DB Object:", Object.keys(db));
  console.log("DB Employees:", db.employees);
  console.log("DB Sequelize:", db.sequelize);
  
 
  // exports.getAllEmployees = async (req, res) => {
  //   try {
  //     // Add extensive logging
  //     console.log("Attempting to retrieve employees");
      
  //     // Defensive programming approach
  //     if (!Employees) {
  //       console.error("Employees model is undefined!");
  //       return res.status(500).json({ 
  //         message: "Database model not initialized",
  //         dbKeys: Object.keys(db)
  //       });
  //     }
  
  //     // Verify if findAll method exists
  //     if (typeof Employees.findAll !== 'function') {
  //       console.error("findAll is not a function", typeof db.employees.findAll);
  //       return res.status(500).json({ 
  //         message: "Invalid model configuration",
  //         employeesType: typeof Employees
  //       });
  //     }
  
  //     const employees = await Employees.findAll();
  
  //     if (!employees || employees.length === 0) {
  //       return res.status(200).json({
  //         message: "No employees found",
  //         count: 0,
  //         employees: []
  //       });
  //     }
  
  //     res.status(200).json({
  //       message: "Employees retrieved successfully",
  //       count: employees.length,
  //       employees: employees
  //     });
  
  //   } catch (error) {
  //     console.error("Comprehensive Error:", {
  //       message: error.message,
  //       stack: error.stack,
  //       name: error.name
  //     });
  
  //     res.status(500).json({ 
  //       message: "Internal Server Error", 
  //       errorDetails: error.message 
  //     });
  //   }
  // };

  exports.getAllEmployees = async (req, res) => {
    try {
      const employees = await Employees.findAll(); // Access Employees model properly
      res.json(employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };