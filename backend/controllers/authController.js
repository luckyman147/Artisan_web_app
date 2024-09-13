import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import ErrorResponse from '../utils/errorResponse.js';

export const register = async (req, res, next) => {
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
export const verifyEmail = async (req, res, next) => {
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
export const login = async (req, res, next) => {
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
            token,
            id: user._id,
            role : user.role
        });
    } catch (error) {
        next(error);
    }
};

// Forgot password
export const  forgotPassword = async (req, res, next) => {
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
export const resetPassword = async (req, res, next) => {
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



export const googleCallback = async (req, res) => {
    const user = req.user;
    if (!user.password) {
        user.password = null; // Ne pas stocker de mot de passe pour les connexions sociales
    }
    await user.save();
    const data = ({ token: generateToken(user), id: user._id});
    res.redirect(`http://localhost:5173/products?token=${data.token}&id=${data.id}`);
};

// Facebook callback
export const facebookCallback = async (req, res) => {
    const user = req.user;
    if (!user.password) {
        user.password = null; // Ne pas stocker de mot de passe pour les connexions sociales
    }
    await user.save();
    const data = ({ token: generateToken(user), id: user._id }); 
    res.redirect(`http://localhost:5173/products?token=${data.token}&id=${data.id}`);

};
// Fonction pour générer un token JWT
const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export const resendVerificationEmail = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        if (user.isVerified) {
            return next(new ErrorResponse('Email already verified', 400));
        }

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
            message: 'Verification email resent'
        });
    } catch (error) {
        next(error);
    }
};

// controllers/authController.js
export const getMe = async (req, res) => {
    try {
      const userId = req.params.id;      
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      res.json(user);
    } catch (error) {
      console.error('Erreur dans getMe:', error.message);
      res.status(500).send('Erreur serveur');
    }
  };
  
  export const getArtisan = async (req, res) => {
    try {
      const userId = req.params.id;      
      const user = await User.find({role :"artisan"}).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      res.json(user);
    } catch (error) {
      console.error('Erreur dans getMe:', error.message);
      res.status(500).send('Erreur serveur');
    }
  };
  