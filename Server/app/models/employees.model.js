module.exports = (sequelize, DataTypes) => {
  const Employees = sequelize.define(
    "employees",
    {
      id: {
        type: DataTypes.UUID, // Use UUID for unique ID
        defaultValue: DataTypes.UUIDV4, // Auto-generate UUID
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false, // Ensure name is required
      },
      skill: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      cost: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      archivedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true, // Automatically manages createdAt & updatedAt
      paranoid: true, // Enables soft delete using `deletedAt`
    }
  );

  return Employees;
};
