'use strict';



/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example: */
      await queryInterface.bulkInsert('customers', [
        {
          id: 'ba629a71-967f-4fef-9a77-20145b5fac8f',
        firstName: 'pranav',
        lastName: 'khairnar',
        email: 'abc@gmail.com',
        username: 'Pranav',
        password: '$2b$10$ASum3wato5CRWBTAzgTDp.MwWXS5hWg.XWkzWGMZKPKrqlmZ9fjIO',
        isAdmin:true,
        mobile:'8776293090',
        netWorth:15000,
        createdAt: new Date(),
        updatedAt: new Date()

      },
    ]);
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
