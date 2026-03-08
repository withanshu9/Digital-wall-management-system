const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'Not all fields have been entered.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'An account with this email already exists.' });
        }

        const newUser = new User({ name, email, password, role });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Not all fields have been entered.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            // Return 200 to prevent email enumeration attacks
            return res.status(200).json({ message: 'If that email is registered, a reset link has been sent.' });
        }

        // Generate a new secure token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const tokenExpiry = Date.now() + 15 * 60 * 1000; // 15 mins

        user.resetToken = resetToken;
        user.resetTokenExpiry = tokenExpiry;
        await user.save();

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Request',
                message: `You requested a password reset. Please click on the following link or paste it into your browser to complete the process: \n\n ${resetUrl} \n\n This link will expire in 15 minutes.`
            });

            res.status(200).json({ message: 'If that email is registered, a reset link has been sent.' });
        } catch (err) {
            user.resetToken = null;
            user.resetTokenExpiry = null;
            await user.save();
            return res.status(500).json({ message: 'Email could not be sent. Please try again later.' });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() } // Ensure token hasn't expired yet
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token.' });
        }

        // Overwrite password. Pre-save hook will handle the bcrypt hashing safely.
        user.password = newPassword;
        // Invalidate token
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        await user.save();
        res.status(200).json({ message: 'Password has been successfully reset. You may now login.' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
