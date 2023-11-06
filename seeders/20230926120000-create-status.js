'use strict';
const bcryptjs = require("bcryptjs");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('statuses', [
      {
        name: 'Asignado',
        machine_name: 'asignado',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Iniciado',
        machine_name: 'iniciado',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Finalizado exito',
        machine_name: 'finalizado-exito',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Finalizado error',
        machine_name: 'finalizado-error',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'En espera',
        machine_name: 'en-espera',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('statuses', null, {});
  },
};
