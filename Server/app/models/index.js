const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/db.config.js");

// Create Sequelize instance
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
  logging: false, // Set `true` to see SQL queries
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.Employees = require("./employees.model.js")(sequelize, DataTypes);
db.Team = require("./team.model.js")(sequelize,  DataTypes);
// Export database object
module.exports = db;
