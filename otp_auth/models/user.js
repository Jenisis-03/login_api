'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.UserDetail, {
        foreignKey: 'userId',
        as: 'details'
      });
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    dob: DataTypes.DATE,
    otp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    otp_expires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user'
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};