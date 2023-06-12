'use strict';
const {
  Model
} = require('sequelize');
const uuid = require('uuid');

module.exports = (sequelize, DataTypes) => {
  class transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
    }
  }
  transactions.init({
    transferFrom: DataTypes.UUID,
    transferTo: {
      type: DataTypes.UUID,
      allowNull: true
    },
    amount: DataTypes.FLOAT,
    toClosingBalance: DataTypes.FLOAT,
    fromClosingBalance: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'transactions',
    hooks: {
      beforeCreate: async (transactions) => {
        transactions.id = uuid.v4();
      }
    },
    paranoid: true
  });
  return transactions;
};