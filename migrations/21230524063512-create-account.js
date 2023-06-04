'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('accounts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      bankID: {
        type: Sequelize.UUID,
        references: {
          model: 'banks',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      balance: {
        type: Sequelize.INTEGER
      },
      customerID: {
        type: Sequelize.UUID,
        references: {
          model: 'customers',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('accounts');
  }
};