const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/databaseConnection");
const Task = require("./Task");
const Status = require("./Status");

const ListStatus = sequelize.define(
  "list_statuses",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    task_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Task",
        key: "id",
      },
      onUpdate: "NO ACTION",
      onDelete: "CASCADE",
    },
    status_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Status",
        key: "id",
      },
      onUpdate: "NO ACTION",
      onDelete: "NO ACTION",
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

ListStatus.belongsTo(Task, { foreignKey: "task_id" });
Task.hasMany(ListStatus, { foreignKey: "task_id" });

ListStatus.belongsTo(Status, { foreignKey: "status_id", as: "statuses"});
Status.hasMany(ListStatus, { foreignKey: "status_id", as: "statuses"});


module.exports = ListStatus;
