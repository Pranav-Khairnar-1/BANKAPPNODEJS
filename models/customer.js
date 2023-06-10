
'use strict';
const uuid = require('uuid');
const bcrypt = require('bcrypt')
const {
  Model
} = require('sequelize');
// const Customer = require('../view/customer');
module.exports = (sequelize, DataTypes) => {
  class customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      customer.hasMany(models.account, {
        foreignKey: {
          name: 'customerID',
          type: DataTypes.UUID
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  customer.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    mobile: DataTypes.STRING,
    username: {
      type: DataTypes.STRING,
      defaultValue: 0,
      allowNull: false
    },
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    netWorth: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'customer',
    paranoid: true,
    hooks: {
      beforeCreate: async (customer) => {
        customer.id = uuid.v4();
        customer.password = await bcrypt.hash(customer.password, 10);
      }
    }
  });
  return customer;
};