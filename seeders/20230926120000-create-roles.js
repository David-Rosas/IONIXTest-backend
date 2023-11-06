'use strict';
const bcryptjs = require("bcryptjs");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('roles', [
      {
        name: 'administrator',
        machine_name: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'execute',
        machine_name: 'execute',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
