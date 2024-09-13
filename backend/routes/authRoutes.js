import express from 'express';
import passport from 'passport';
import { checkAuth } from '../middlewares/auth.js';

import { register, verifyEmail, login,getMe, googleCallback, facebookCallback, resetPassword,forgotPassword,resendVerificationEmail,getArtisan } from '../controllers/authController.js';
const router = express.Router();

router.post('/register', register);
router.get('/verify/:token', verifyEmail);
router.post('/login', login);
router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google', passport.authenticate('google', { failureRedirect: '/' }), googleCallback);
router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:token', resetPassword);
router.get('/me/:id',checkAuth, getMe);
router.get('/artisan/:id',checkAuth, getArtisan);


router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), facebookCallback);
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});
router.post('/resend-verification', resendVerificationEmail);


export default router; 
