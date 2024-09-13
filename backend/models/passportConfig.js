import passport from 'passport';

import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';

import User from './User.js';

const initializePassport = () => {



passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GooglecallbackURL
}, async (accessToken, refreshToken, profile, done) => {
    const { id, emails, name } = profile;

    let user = await User.findOne({ 
        $or: [
            {  email: emails[0].value  },
            { googleId: profile.id }
        ]
     });
    if (!user) {
        user = await User.create({ 
            firstname: name.givenName,
            lastname: name.familyName,
            email: emails[0].value,
            password: process.env.defaultPassword ,
            googleId: profile.id,
            isVerified : true


        });
    }
    done(null, user);
}));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FacebookcallbackURL,
    profileFields: ['id', 'emails', 'first_name', 'last_name']
}, async (accessToken, refreshToken, profile, done) => {
    const { id, emails, name } = profile;
    let user = await User.findOne({
        $or: [
            {  email: emails[0].value  },
            { facebookId: profile.id }
        ]
        
        });
    if (!user) {
        user = await User.create({
            firstname: name.givenName,
            lastname: name.familyName,
            email: emails[0].value,
            password: process.env.defaultPassword,
            facebookId: profile.id,
            isVerified : true
        });
    }
    done(null, user);
}));

}
export default initializePassport;
