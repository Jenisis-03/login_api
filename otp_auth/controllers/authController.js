const { generateOtp, getOtpExpiry } = require('../utils/otpUtils');
const { sendEmail } = require('../utils/emailUtils');
const { generateToken } = require('../utils/jwtUtils');
const User = require('../models').User;
const { OTP } = require('../models');

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Sign up or send OTP to email
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
exports.signup = async (req, res) => {
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
 * /api/auth/login:
 *   post:
 *     summary: Login or resend OTP
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
exports.login = async (req, res) => {
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
// Change this line from const to exports
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Add input validation
        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }

        // Add rate limiting check
        const user = await User.findOne({ where: { email } });

        if (!user || user.otp !== otp || new Date() > user.otp_expires) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        // Add OTP expiration check
        const otpRecord = await OTP.findOne({
            where: { email: email },
            order: [['createdAt', 'DESC']]
        });

        if (!otpRecord) {
            return res.status(400).json({ error: 'No OTP found for this email' });
        }

        // Check if OTP is expired (e.g., 5 minutes)
        const otpAge = Date.now() - otpRecord.createdAt;
        if (otpAge > 5 * 60 * 1000) {
            return res.status(400).json({ error: 'OTP has expired' });
        }

        // Add retry attempts check
        if (otpRecord.attempts >= 3) {
            return res.status(400).json({ error: 'Maximum retry attempts exceeded' });
        }

        // Verify OTP
        if (otpRecord.otp !== otp) {
            await otpRecord.update({ attempts: otpRecord.attempts + 1 });
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        await user.update({ verified: true });

        const token = generateToken(user.id);

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error in verifyOtp:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Access protected route with JWT
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Protected data
 *         content:
 *           application/json:
 *             example:
 *               message: "Access granted to protected route"
 *               userId: "1"
 *       401:
 *         description: Unauthorized
 */
exports.profile = (req, res) => {
    res.json({ message: "Access granted to protected route", userId: req.userId });
};