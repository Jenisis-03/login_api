// models/otp.js
module.exports = (sequelize, DataTypes) => {
  const OTP = sequelize.define('OTP', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    }
  });
  return OTP;
};
