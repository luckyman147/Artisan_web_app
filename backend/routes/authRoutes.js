import express from 'express';
import passport from 'passport';
import { checkAuth,refreshAuth,checkAdmin } from '../middlewares/auth.js';

import {getAllUser,getAllAdmin,AdminUpdateUserSettings, register, verifyEmail, login,getMe, googleCallback, facebookCallback, resetPassword,forgotPassword,resendVerificationEmail,getArtisan,updateUserSettings,sendEmailVerification, getAllArtisan } from '../controllers/authController.js';
const router = express.Router();
import  {uploadAvatar}  from '../middlewares/uploadPhoto.js';

router.post('/register', register);
router.get('/verify/:token', verifyEmail);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:token', resetPassword);
router.get('/me/:id',checkAuth, getMe);
router.get('/artisan/:id', getArtisan);
router.put('/settings/:id', checkAuth, uploadAvatar.single('avatar'), updateUserSettings);
router.post('/send-Verfiation', sendEmailVerification);
router.post('/refresh-token', refreshAuth);

router.get('/all_artisan',getAllArtisan);
router.get('/all_user',checkAuth,checkAdmin,getAllUser);
router.get('/all_Admin',checkAuth,checkAdmin,getAllAdmin);

router.put('/update_all_user/:id', checkAuth,checkAdmin, uploadAvatar.single('avatar'), AdminUpdateUserSettings);

router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google', passport.authenticate('google', { failureRedirect: '/' }), googleCallback);
router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), facebookCallback);
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});
router.post('/resend-verification', resendVerificationEmail);


export default router; 
