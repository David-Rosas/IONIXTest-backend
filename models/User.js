const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/databaseConnection");
const Role = require("./Rol");

const User = sequelize.define("users", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    unique: true
  },
  password: {
    type: Sequelize.STRING
  },
  codeRecover: {
    type: Sequelize.STRING,
  },
  rol_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'roles',
      key: 'id',
    }
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  }
});

User.belongsTo(Role, { foreignKey: 'rol_id' });
Role.hasOne(User, { foreignKey: 'rol_id' });

module.exports = User;