
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
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    netWorth: {
      type: DataTypes.DECIMAL,
      defaultValue: 0,
      allowNull: false
    }
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