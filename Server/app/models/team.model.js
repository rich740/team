module.exports = (sequelize, DataTypes) => {
    const Team = sequelize.define("Team", {
      id: {
        type: DataTypes.UUID, // Use UUID for unique team ID
        defaultValue: DataTypes.UUIDV4, // Auto-generate UUID
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure team names are unique
      },
    });
  
    return Team;
  };
  