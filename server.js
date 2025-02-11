require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const path = require('path');
const { sequelize, User } = require('./db');
const authRoutes = require('./routes/authRoutes');
const playlistRoutes = require('./routes/playlistRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views')); // Set views directory to public/views

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            // Extract and modify user object here
            const gUser = {
                google_id: profile.id,
                display_name: profile.displayName,
                email: profile.emails[0].value,
                profile_picture: profile.photos[0].value,
            };

            // Find or create the user in the database
            const [dbUser, created] = await User.findOrCreate({
                where: { google_id: profile.id },
                defaults: gUser,
            });

            done(null, dbUser);
        }
    )
);

// Serialize User to session
passport.serializeUser((gUser, done) => {
    done(null, gUser.google_id);
});

// Deserialize User from session
passport.deserializeUser(async (google_id, done) => {
    try {
        const user = await User.findOne({ where: { google_id } });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Auth Routes
app.use('/auth', authRoutes);

// Playlist Routes
app.use('/playlists', playlistRoutes);

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/profile', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const user = await User.findOne({ where: { google_id: req.user.google_id } });
            res.render('profile', { user });
        } catch (err) {
            res.status(500).send('Server Error');
        }
    } else {
        res.redirect('/');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});