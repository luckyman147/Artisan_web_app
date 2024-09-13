import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// middlewares/auth.js
export const checkAuth = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé, aucun token fourni' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    console.error('Erreur de vérification de token', error);
    res.status(401).json({ message: 'Token invalide' });
  }
};

export const  isArtisan = (req, res, next) => {
  if (req.user.role !== 'artisan') return res.status(403).json({ error: req.user.role });

  next();
};

