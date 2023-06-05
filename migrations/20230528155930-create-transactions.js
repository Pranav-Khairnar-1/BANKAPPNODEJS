'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        // autoIncrement: true,
        primaryKey: true,
        type: Sequelize.UUID
      },
      transferFrom: {
        type: Sequelize.UUID,
        references: {
          model: 'account',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      transferTO: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: 'account',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      amount: {
        type: Sequelize.FLOAT
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
  }
};