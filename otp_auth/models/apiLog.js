'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ApiLog extends Model {}
  
  ApiLog.init({
    method: DataTypes.STRING,
    path: DataTypes.STRING,
    requestData: DataTypes.JSON,     
    responseData: DataTypes.JSON,    
    userId: DataTypes.INTEGER,
    duration: DataTypes.INTEGER,
    timestamp: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ApiLog',
  });
  
  return ApiLog;
};