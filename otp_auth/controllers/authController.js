const { generateOtp, getOtpExpiry } = require('../utils/otpUtils');
const { sendEmail } = require('../utils/emailUtils');
const { generateToken } = require('../utils/jwtUtils');
const User = require('../models').User;

/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: Send OTP to user's email address
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *             required: ["email"]
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "OTP sent successfully"
 *               email: "user@example.com"
 */
exports.sendOtp = async (req, res) => {
    const { email } = req.body;

    const otp = generateOtp();
    const otpExpires = getOtpExpiry();

    let user = await User.findOne({ where: { email } });

    if (!user) {
        user = await User.create({
            email,
            otp,
            otp_expires: otpExpires
        });
    } else {
        await user.update({ otp, otp_expires: otpExpires });
    }

    await sendEmail(email, otp);

    res.status(200).json({ message: "OTP sent successfully", email });
};

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP and get JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *             required: ["email", "otp"]
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx"
 *       400:
 *         description: Invalid or expired OTP
 */
exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user || user.otp !== otp || new Date() > user.otp_expires) {
        return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    await user.update({ verified: true });

    const token = generateToken(user.id);

    res.status(200).json({ token });
};