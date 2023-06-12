'use strict';
const {
  Model
} = require('sequelize');
const uuid = require('uuid');

module.exports = (sequelize, DataTypes) => {
  class account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      account.belongsTo(models.customer, {
        foreignKey: {
          name: 'customerID',
          type: DataTypes.UUID
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'

      });

      
      account.belongsTo(models.bank, {
        foreignKey: {
          name: 'bankID',
          type: DataTypes.UUID,
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  account.init({
    bankID: DataTypes.UUID,
    balance: DataTypes.INTEGER,
    customerID: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'account',
    paranoid: true,
    hooks: {
      beforeCreate: async (account) => {
        account.id = uuid.v4();
      }
    }
  });
  return account;
};