const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

function initializePassport() {
// User serialization (for session)
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Google OAuth Strategy

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GooglecallbackURL
}, (accessToken, refreshToken, profile, done) => {
  // Your user handling logic here
  return done(null, profile);
}));


// Facebook OAuth Strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FacebookcallbackURL,
  profileFields: ['id', 'emails', 'name'] // fields to request
}, (accessToken, refreshToken, profile, done) => {
  // Similar to Google strategy, process the profile info here
  return done(null, profile);
}));
}
module.exports = initializePassport;
