const { generateOtp, getOtpExpiry } = require('../utils/otpUtils');
const { generateToken } = require('../utils/jwtUtils');
const User = require('../models').User;


exports.sendOtp = async (req, res) => {
    const { phone } = req.body;

    const otp = generateOtp();
    const otpExpires = getOtpExpiry();

    let user = await User.findOne({ where: { phone } });

    if (!user) {
        user = await User.create({
            phone,
            otp,
            otp_expires: otpExpires
        });
    } else {
        await user.update({ otp, otp_expires: otpExpires });
    }

    console.log("Generated OTP:", otp);

    res.status(200).json({ message: "OTP sent successfully", phone });
};

// @route POST /api/auth/verify-otp
exports.verifyOtp = async (req, res) => {
    const { phone, otp } = req.body;

    const user = await User.findOne({ where: { phone } });

    if (!user || user.otp !== otp || new Date() > user.otp_expires) {
        return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    await user.update({ verified: true });

    const token = generateToken(user.id);

    res.status(200).json({ token });
};