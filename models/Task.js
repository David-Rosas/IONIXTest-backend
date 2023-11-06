const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/databaseConnection");
const User = require("./User");

const Task = sequelize.define(
  "tasks", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    expiration_date: {
      type: Sequelize.DATEONLY,
    },
    user_creator_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "User",
        key: "id",
      },
    },
    user_execute_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "User",
        key: "id",
      },
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }
);

Task.belongsTo(User, { foreignKey: "user_creator_id" });
User.hasMany(Task, { foreignKey: "user_creator_id" });

Task.belongsTo(User, { foreignKey: "user_execute_id" });
User.hasMany(Task, { foreignKey: "user_execute_id" });


module.exports = Task;
