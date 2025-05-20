const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendEmail(email, otp) {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP is: ${otp}`
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { sendEmail };