const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require("path");
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

//Oauth
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/auth/google/callback' //TODO: use environment variable for the callback
}, function(accessToken, refreshToken, profile, done) {
    userProfile = profile;
    return done(null, userProfile);
}));

app.use(passport.initialize());

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.OAUTH_CLIENT_SECRET
}));

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../build/")));
}

//TODO: Change to /public/public/api/
app.use("/public/api", publicRoutes);


//Auth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['email']}));

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login?redirect=googleAuthFailure' }), 
    async (req, res) => {

        const userEmail = PassportWrapper.getUserEmail(req);
        if (await Security.doesUserExistWithEmail(userEmail)) {
            //Update Login
            console.log('user exists:', userEmail);
            await Security.createAndSetSessionCookie(userEmail, 'GOOGLEPASS', req.device.type.toUpperCase(), res);
        } else {
            //Insert new user
            console.log('user does not exist');
            await Security.createNewUser(userEmail, 'GOOGLEPASS', userEmail, req.device.type.toUpperCase(), res);
        }
        res.redirect('http://localhost:3000/');
});

// the catch all route
if (process.env.NODE_ENV === "production") {
    app.all('*', (req, res) => {
        res.sendFile(path.join(__dirname + '/../build/index.html'));
    });
}

app.listen(process.env.PORT || 8080, () => console.log('EPL Predictor Server app listening on port 8080!'))