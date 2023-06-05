'use strict';
const {
  Model
} = require('sequelize');
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

      account.hasMany(models.transactions, {
        foreignKey: {
          name: 'transferFrom',
          type: DataTypes.UUID
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      account.hasMany(models.transactions, {
        foreignKey: {
          name: 'transferTo',
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
    underscored: true,
    paranoid: true
  });
  return account;
};