const express = require('express');
const passport = require('passport');
const { register, verifyEmail, login, forgotPassword, resetPassword, googleAuth, googleCallback } = require('../controllers/authController');

const router = express.Router(); 

router.post('/register', register);
router.get('/verify/:token', verifyEmail);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:token', resetPassword);
router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook', passport.authenticate('facebook'), (req, res) => {
  res.redirect('/');
});

router.get('/login/google', googleAuth);
router.get('/google/callback', googleCallback);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
