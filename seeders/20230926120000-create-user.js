'use strict';
const bcryptjs = require("bcryptjs");
module.exports = {
  up: async (queryInterface, Sequelize) => {
//encriptacion de contraseña
  const passwordHast = await bcryptjs.hash('123456', 10);
    await queryInterface.bulkInsert('users', [
      {
        name: 'administrator',
        email: 'admin@gmail.com',
        password: passwordHast,
        rol_id:1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'david',
        email: 'david@gmail.com',
        password: passwordHast,
        rol_id:2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'valeska',
        email: 'valeska@gmail.com',
        password: passwordHast,
        rol_id:2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
