const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1hrs' });
}

function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { generateToken, verifyToken };