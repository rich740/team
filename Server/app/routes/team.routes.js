const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');

// GET all teams
router.get('/getteam', teamController.getAllTeams);

// POST create a new team
router.post('/team', teamController.createTeam);

// DELETE a team
router.delete('/deleteteam/:id', teamController.deleteTeam);

module.exports = router;