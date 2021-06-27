const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();
const publicRoutes = require('./routes/public');
const device = require('express-device');
const session = require('express-session');
const passport = require('passport');
const PassportWrapper = require('./service/PassportWrapper');
const Security = require('./service/Security');

// parse application/x-www-9form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());
app.use(device.capture());

// Oauth
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const GOOGLE_REDIRECT_URL = process.env.OAUTH_REDIRECT_URL;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL:  GOOGLE_REDIRECT_URL
}, function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));

app.use(passport.initialize());

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.OAUTH_CLIENT_SECRET
}));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../build/')));
}

// TODO: Change to /public/public/api/
app.use('/public/api', publicRoutes);

// Auth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['email']}));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login?redirect=googleAuthFailure' }),
    async (req, res) => {

        const userEmail = PassportWrapper.getUserEmail(req);
        const existingUsername = await Security.doesUserExistWithEmail(userEmail);
        if (existingUsername) {
            // Update Login
            await Security.createAndSetSessionCookie(existingUsername, 'GOOGLEPASS', req.device.type.toUpperCase(), res);
        } else {
            // Insert new user
            await Security.createNewUser(userEmail, 'GOOGLEPASS', userEmail, req.device.type.toUpperCase(), res, true);
            return res.redirect('/updateUsername');
        }
        res.redirect('/');
    });

// the catch all route
if (process.env.NODE_ENV === 'production') {
    app.all('*', (req, res) => {
        res.sendFile(path.join(__dirname + '/../build/index.html'));
    });
}

app.listen(process.env.PORT || 8080, () => console.log('EPL Predictor Server app listening on port 8080!'));
