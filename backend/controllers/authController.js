const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const ErrorResponse = require('../utils/errorResponse');
const passport = require('passport');
 
// Register a new user
exports.register = async (req, res, next) => {
    const { firstname, lastname, email, password, role, phone, address, company_name, isVerified } = req.body;

    try {
        const user = await User.create({
            firstname,
            lastname,
            email,
            password,
            role,
            phone,
            address,
            company_name,
            isVerified
        });

        const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        const verificationUrl = `${process.env.BASE_URL}/api/auth/verify/${verificationToken}`;

        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const message = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Verify Your Email',
            text: `Please click the following link to verify your email: ${verificationUrl}`
        };

        await transporter.sendMail(message);

        res.status(200).json({
            success: true,
            message: 'Verification email sent'
        });
    } catch (error) {
        next(error);
    }
};

// Verify email address
exports.verifyEmail = async (req, res, next) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return next(new ErrorResponse('Invalid token', 400));
        }

        user.isVerified = true;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Email verified'
        });
    } catch (error) {
        next(error);
    }
};

// Login user
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        if (!user.isVerified) {
            return next(new ErrorResponse('Email not verified', 401));
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(200).json({
            success: true,
            token
        });
    } catch (error) {
        next(error);
    }
};

// Forgot password
exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        const resetToken = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        const resetUrl = `${process.env.BASE_URL}/api/auth/resetpassword/${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const message = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset',
            text: `Please click the following link to reset your password: ${resetUrl}`
        };

        await transporter.sendMail(message);

        res.status(200).json({
            success: true,
            message: 'Reset password email sent'
        });
    } catch (error) {
        next(error);
    }
};

// Reset password
exports.resetPassword = async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return next(new ErrorResponse('Invalid or expired token', 400));
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (error) {
        next(error);
    }
};

// Google authentication
exports.googleAuth = passport.authenticate('google', {
    scope: ['profile', 'email']
});

// Google callback

exports.facebookAuth = passport.authenticate('facebook');

// Handle callback from Facebook
exports.googleCallback = (req, res) => {
    res.redirect('/');
  };
  
  exports.facebookCallback = (req, res) => {
    res.redirect('/');
  }

// Redirect after successful authentication
exports.redirectToProfile = (req, res) => {
    res.redirect('/');
};
