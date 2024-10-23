import User from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import ErrorResponse from "../utils/errorResponse.js";
import bcrypt from "bcryptjs";

export const register = async (req, res, next) => {
  const {
    firstname,
    lastname,
    email,
    password,
    role,
    phone,
    address,
    company_name,
    isVerified,
  } = req.body;

  try {
    // Create the user in the database
    const user = await User.create({
      firstname,
      lastname,
      email,
      password,
      role,
      phone,
      address,
      company_name,
      isVerified,
    });

    // Generate a verification token
    const verificationToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    if (user.role === "artisan") {
      return res.status(200).json({
        success: true,
        message: "Wait for Admin Approval",
      });
    }

    // Generate verification URL
    const verificationUrl = `${process.env.BASE_URL}/api/auth/verify/${verificationToken}`;

    // Setup email transporter using nodemailer
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const message = {
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: 'Verify Your Email',
      html: `
        <h2>Hello ${user.firstname},</h2>
        <p>Thank you for registering. Please click the button below to verify your email address:</p>
        <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>If you did not request this, please ignore this email.</p>
        <p>Best regards,<br>Your Company Name</p>
      `,
    };

    // Send the email
    await transporter.sendMail(message);

    // Respond to the client
    res.status(200).json({
      success: true,
      message: "Verification email sent",
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
      return next(new ErrorResponse("Invalid token", 400));
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified",
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    if (!user.isVerified) {
      return next(new ErrorResponse("Email not verified", 401));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      token,
      id: user._id,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

// Forgot password
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetUrl = `${process.env.BASE_URL}/api/auth/resetpassword/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const message = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset",
      text: `Please click the following link to reset your password: ${resetUrl}`,
    };

    await transporter.sendMail(message);

    res.status(200).json({
      success: true,
      message: "Reset password email sent",
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
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid or expired token", 400));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    next(error);
  }
};

export const googleCallback = async (req, res) => {
  const user = req.user;
  if (!user.password) {
    user.password = null;
  }
  await user.save();
  const data = { token: generateToken(user), id: user._id };
  res.redirect(
    `http://localhost:5173/products?token=${data.token}&id=${data.id}`
  );
};

// Facebook callback
export const facebookCallback = async (req, res) => {
  const user = req.user;
  if (!user.password) {
    user.password = null;
  }
  await user.save();
  const data = { token: generateToken(user), id: user._id };
  res.redirect(
    `http://localhost:5173/products?token=${data.token}&id=${data.id}`
  );
};
// Fonction pour générer un token JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

export const resendVerificationEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    if (user.isVerified) {
      return next(new ErrorResponse("Email already verified", 400));
    }

    const verificationToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const verificationUrl = `${process.env.BASE_URL}/api/auth/verify/${verificationToken}`;

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const message = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Verify Your Email",
      text: `Please click the following link to verify your email: ${verificationUrl}`,
    };

    await transporter.sendMail(message);

    res.status(200).json({
      success: true,
      message: "Verification email resent",
    });
  } catch (error) {
    next(error);
  }
};

// controllers/authController.js
export const getMe = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(user);
  } catch (error) {
    console.error("Erreur dans getMe:", error.message);
    res.status(500).send("Erreur serveur");
  }
};

export const getArtisan = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(user);
  } catch (error) {
    console.error("Erreur dans getMe:", error.message);
    res.status(500).send("Erreur serveur");
  }
};

export const sendEmailVerification = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    // Generate a verification token
    const verificationToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const verificationUrl = `${process.env.BASE_URL}/settings/${verificationToken}`;

    // Setup the email transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const message = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Verify Your Email",
      text: `Please click the following link to verify your email: ${verificationUrl}`,
    };

    // Await the email sending
    await transporter.sendMail(message);

    res.status(200).json({ message: "Verification email sent." });
  } catch (error) {
    console.error("Error sending email verification:", error);
    res.status(500).json({ message: "Failed to send verification email." });
  }
};

export const updateUserSettings = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const allowedUpdates = [
      "firstname",
      "lastname",
      "password",
      "email",
      "phone",
      "avatar",
      "role",
      "address",
      "shopDescription",
      "company_name",
    ];

    const updates = Object.keys(req.body)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        // Check if the password is being updated
        if (key === "password" && req.body.password) {
          obj[key] = req.body.password;
        } else if (key !== "password") {
          obj[key] = req.body[key];
        }
        return obj;
      }, {});

    const user = await User.findById(userId).select("+email password");

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    if (req.file) {
      updates.avatar = req.file.path;
    }

    // Hash the password if it's being updated
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    // Update the user's settings
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllArtisan = async (req, res) => {
  try {
    const users = await User.find({ role: "artisan" }).select("-password");

    res.json(users);
  } catch (error) {
    console.error("Erreur dans getAllArtisan:", error.message);
    res.status(500).send("Erreur serveur");
  }
};
export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");

    res.json(users);
  } catch (error) {
    console.error("Erreur dans getAllArtisan:", error.message);
    res.status(500).send("Erreur serveur");
  }
};

export const AdminUpdateUserSettings = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const allowedUpdates = [
      "firstname",
      "lastname",
      "password",
      "email",
      "phone",
      "role",
      "avatar",
      "address",
      "shopDescription",
      "company_name",
      "isVerified",
    ];

    const updates = Object.keys(req.body)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        // Check if the password is being updated
        if (key === "password" && req.body.password) {
          obj[key] = req.body.password;
        } else if (key !== "password") {
          obj[key] = req.body[key];
        }
        return obj;
      }, {});

    const user = await User.findById(userId).select("+email password");

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    if (req.file) {
      updates.avatar = req.file.path;
    }

    // Hash the password if it's being updated
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    // Update the user's settings
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
export const getAllAdmin = async (req, res) => {
  try {
    const users = await User.find({ role: "Admin" }).select("-password");

    res.json(users);
  } catch (error) {
    console.error("Erreur dans getAllArtisan:", error.message);
    res.status(500).send("Erreur serveur");
  }
};
