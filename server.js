require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const authRoutes = require('./routes/authRoutes');

const PORT = process.env.PORT || 3000;
const app = express();

// Set view engine to EJS
app.set('view engine', 'ejs');

// Set views directory
app.set('views', __dirname + '/public/views');

// Express Session Middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Google Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
        },
        (accessToken, refreshToken, profile, done) => {
            done(null, profile);
        }
    )
);

// Serialize User to session
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize User from session
passport.deserializeUser((user, done) => {
    done(null, user);
});

// Auth Routes
app.use('/auth', authRoutes);

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        // pass user object to profile view
        res.render('profile', { user: req.user });
    } else {
        res.redirect('/');
    }
});

app.get('/playlists', (req, res) => {
    if (req.isAuthenticated()) {
        // pass user object to playlists view
        res.render('playlists', { user: req.user });
    } else {
        res.redirect('/');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
