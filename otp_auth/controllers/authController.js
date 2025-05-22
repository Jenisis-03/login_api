const { generateOtp, getOtpExpiry } = require('../utils/otpUtils');
const { sendEmail } = require('../utils/emailUtils');
const { generateToken } = require('../utils/jwtUtils');
const User = require('../models').User;
const { OTP } = require('../models');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         name:
 *           type: string
 *         address:
 *           type: string
 *         dob:
 *           type: string
 *           format: date
 *         role:
 *           type: string
 *           enum: [admin, user]
 *           default: user
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     tags: [Authentication]
 *     summary: Sign up a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               name:
 *                 type: string
 *                 example: John Doe
 *               address:
 *                 type: string
 *                 example: 123 Main St
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: 1990-01-01
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 default: user
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Email already registered
 */

/**
 * @swagger
 * /api/auth/admin/create-user:
 *   post:
 *     tags: [Admin]
 *     summary: Create a new user (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: newuser@example.com
 *               name:
 *                 type: string
 *                 example: New User
 *               address:
 *                 type: string
 *                 example: 456 Oak St
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: 1990-01-01
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 default: user
 *     responses:
 *       201:
 *         description: User created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied - Admin only
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     tags: [Authentication]
 *     summary: Sign up or send OTP to email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               name:
 *                 type: string
 *                 example: John Doe
 *               address:
 *                 type: string
 *                 example: 123 Main St
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: 1990-01-01
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     tags: [Authentication]
 *     summary: Verify OTP and get JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: JWT token generated successfully
 *       400:
 *         description: Invalid OTP or email
 */

/**
 * @swagger
 * /api/auth/update-profile:
 *   put:
 *     tags: [Profile]
 *     summary: Update user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               address:
 *                 type: string
 *                 example: 123 Main St
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: 1990-01-01
 *               details:
 *                 type: object
 *                 properties:
 *                   phone:
 *                     type: string
 *                     example: 1234567890
 *                   gender:
 *                     type: string
 *                     enum: [male, female, other]
 *                     example: male
 *                   occupation:
 *                     type: string
 *                     example: Developer
 *                   city:
 *                     type: string
 *                     example: New York
 *                   state:
 *                     type: string
 *                     example: NY
 *                   country:
 *                     type: string
 *                     example: USA
 *                   pincode:
 *                     type: string
 *                     example: 10001
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login with email to receive OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/signout:
 *   post:
 *     tags: [Authentication]
 *     summary: Sign out user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Signed out successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

// Signup endpoint
exports.signup = async (req, res) => {
    try {
        const { email, name, address, dob, role } = req.body;

        // Check if the requester is an admin when trying to create an admin user
        if (role === 'admin' && (!req.userId || req.userRole !== 'admin')) {
            return res.status(403).json({ error: "Only admins can create admin accounts" });
        }

        let user = await User.findOne({ where: { email } });

        if (user) {
            return res.status(400).json({ error: "Email already registered" });
        }

        user = await User.create({
            email,
            name,
            address,
            dob,
            verified: false,
            role: role || 'user' // Default to 'user' if role is not specified
        });

        res.status(201).json({ 
            message: "Signup successful. Please login to continue.",
            user: {
                email: user.email,
                name: user.name,
                address: user.address,
                dob: user.dob,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Login endpoint - Sends OTP for regular users, direct token for admins
exports.login = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: "User not found. Please sign up first." });
        }

        // Direct login for admin users
        if (user.role === 'admin') {
            const token = generateToken(user.id);
            return res.status(200).json({
                message: "Admin login successful",
                token,
                user: {
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            });
        }

        // Regular OTP flow for non-admin users
        const otp = generateOtp();
        const otpExpires = getOtpExpiry();

        await user.update({ 
            otp, 
            otp_expires: otpExpires,
            verified: false
        });

        await sendEmail(email, otp);

        res.status(200).json({ 
            message: "OTP sent successfully", 
            email 
        });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Verify OTP and generate JWT token
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        if (!user.otp || !user.otp_expires) {
            return res.status(400).json({ error: 'No OTP was requested. Please request a new OTP' });
        }

        // Convert both OTPs to strings and trim any whitespace
        const submittedOtp = otp.toString().trim();
        const storedOtp = user.otp.toString().trim();

        if (submittedOtp !== storedOtp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        const now = new Date();
        if (now > user.otp_expires) {
            // Clear expired OTP
            await user.update({
                otp: null,
                otp_expires: null
            });
            return res.status(400).json({ error: 'OTP has expired. Please request a new one' });
        }

        const token = generateToken(user.id);

        await user.update({
            otp: null,
            otp_expires: null,
            verified: true
        });

        res.status(200).json({
            message: 'OTP verified successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                address: user.address,
                dob: user.dob,
                role: user.role,
                verified: true
            }
        });
    } catch (error) {
        console.error('Error in verifyOtp:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Update profile - Protected by JWT
exports.updateProfile = async (req, res) => {
    try {
        const { name, address, dob } = req.body;
        const userId = req.userId; // From JWT middleware

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await user.update({
            name: name || user.name,
            address: address || user.address,
            dob: dob || user.dob
        });

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                email: user.email,
                name: user.name,
                address: user.address,
                dob: user.dob
            }
        });
    } catch (error) {
        console.error('Error in updateProfile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Sign out
exports.signout = async (req, res) => {
    try {
        // Since JWT is stateless, we just need to tell the client to remove the token
        res.status(200).json({ 
            message: "Signed out successfully"
        });
    } catch (error) {
        console.error('Error in signout:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};