'use strict';
const uuid = require('uuid');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bank extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      bank.hasMany(models.account, {
        foreignKey: {
          name: 'bankID',
          type: DataTypes.UUID
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  bank.init({
    name: DataTypes.STRING,
    abbrevation: DataTypes.STRING,
    activeUsers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    assetWorth: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'bank',
    paranoid: true,
    hooks: {
      beforeCreate: async (bank) => {
        bank.id = uuid.v4();
      }
    }
  });
  return bank;
};