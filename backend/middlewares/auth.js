import jwt from "jsonwebtoken";
import User from "../models/User.js";

// middlewares/auth.js
export const checkAuth = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Accès non autorisé, aucun token fourni" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    // User found and token is valid
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("Erreur de vérification de token", error);

   
    const refreshToken = req.body.token; 
    if (!refreshToken) {
      return res.status(401).json({ message: "Token invalide" });
    }

    // Attempt to refresh the token
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(403).json({ message: "User not found" });
      }

      // Create new access token
      const newAccessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({ accessToken: newAccessToken });
    } catch (refreshError) {
      console.error("Error refreshing token", refreshError);
      return res.status(403).json({ message: "Invalid refresh token" });
    }
  }
};

export const isArtisan = (req, res, next) => {
  if (req.user.role !== "artisan" && req.user.role !== "Admin" ) {
    return res.status(403).json({ error: req.user.role });
  }
  next(); 
};

export const refreshAuth = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    // Generate a new access token
    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error refreshing token", error);
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};
  

export const checkAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Access Denied" });
  }
  next();
};
