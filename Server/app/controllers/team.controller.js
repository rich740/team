const db = require("../models");
const { Op } = require('sequelize');
const Team = db.Team;

// Create a new team
exports.createTeam = async (req, res) => {
  const { name } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json({ message: "Team name is required" });
  }

  try {
    // Check if team already exists
    const existingTeam = await Team.findOne({ where: { name } });
    if (existingTeam) {
      return res.status(400).json({ message: "Team already exists" });
    }

    // Create new team
    const newTeam = await Team.create({ name });

    res.status(201).json({ 
      success: true,
      message: "Team created successfully", 
      team: newTeam 
    });
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Backend: Received delete request for team ID:', id);

    // Perform deletion
    const deletedCount = await Team.destroy({
      where: { id: id }
    });

    if (deletedCount === 0) {
      return res.status(404).json({ 
        message: 'Team not found',
        success: false 
      });
    }

    res.status(200).json({ 
      message: 'Team deleted successfully',
      success: true 
    });
  } catch (error) {
    console.error('Backend: Team deletion error', error);
    res.status(500).json({ 
      message: 'Error deleting team',
      error: error.message,
      success: false 
    });
  }
};
// Optional: Get all teams
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.findAll();
    res.status(200).json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update a team
exports.updateTeam = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json({ 
      success: false,
      message: "Team name is required" 
    });
  }

  try {
    // Check if team exists
    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ 
        success: false,
        message: "Team not found" 
      });
    }

    // Check if another team with the same name exists
    const existingTeam = await Team.findOne({ 
      where: { 
        name, 
        id: { [Op.ne]: id } 
      } 
    });
    
    if (existingTeam) {
      return res.status(400).json({ 
        success: false,
        message: "Another team with this name already exists" 
      });
    }

    // Update team
    await team.update({ name });

    res.status(200).json({ 
      success: true,
      message: "Team updated successfully", 
      team: team 
    });
  } catch (error) {
    console.error("Error updating team:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal Server Error",
      errorDetails: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};