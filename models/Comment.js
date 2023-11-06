const { Sequelize } = require("sequelize");
const sequelize = require("../database/databaseConnection");
const Task = require("./Task");

const Comment = sequelize.define("comments", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  comment: {
    type: Sequelize.STRING,
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
  
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
});

Comment.belongsTo(Task, { foreignKey: "task_id" });
Task.hasMany(Comment, { foreignKey: "task_id" });

module.exports = Comment;
