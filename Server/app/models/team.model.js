module.exports = (sequelize, DataTypes) => {
    const Team = sequelize.define("Team", {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure team names are unique
      },
    });
  
    return Team;
  };
  