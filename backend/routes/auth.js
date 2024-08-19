const express = require('express');
const passport = require('passport');
const { register, verifyEmail, login,facebookAuth,facebookCallback,redirectToProfile, forgotPassword, resetPassword, googleAuth, googleCallback } = require('../controllers/authController');

const router = express.Router(); 

router.post('/register', register);
router.get('/verify/:token', verifyEmail);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:token', resetPassword);
router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));




// Facebook OAuth Routes
router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }));


router.get('/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/' }), 
  facebookCallback
);
router.get('/google', 
  passport.authenticate('google', { failureRedirect: '/' }), 
  (req, res) => {
    res.redirect('/'); // Redirect to your dashboard or any other route
  }
);
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
