// Highly commented as this is a learning project.

/*
This is the main server file for the application. 
It sets up the Express server, configures middleware, 
and defines routes for authentication and playlist management.
*/

require('dotenv').config(); // Load environment variables from .env file
const express = require('express'); // Import express to create web server
const session = require('express-session'); // Import express-session for session management (such as user login state)
const passport = require('passport'); // Import passport for authentication
const GoogleStrategy = require('passport-google-oauth20').Strategy; // Import Google OAuth strategy for passport
const path = require('path'); // Import path module to handle file paths
const { sequelize, User } = require('./db'); // Import database models
const authRoutes = require('./routes/authRoutes'); // Import authentication routes
const playlistRoutes = require('./routes/playlistRoutes'); // Import playlist routes

const app = express(); // Create an instance of express
const PORT = process.env.PORT || 3000; // Set the port to listen on

app.set('view engine', 'ejs'); // Configures app to use EJS as the templating engine for rendering views
app.set('views', path.join(__dirname, 'public/views')); // Set ejs views directory to public/views

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the "public" directory

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use( 
    session({ 
        secret: process.env.SESSION_SECRET, 
        resave: false,
        saveUninitialized: true,
    })
); // Initialize session middleware with a secret key

app.use(passport.initialize()); // Initialize passport middleware
app.use(passport.session()); // Initialize passport session management

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

            done(null, dbUser); // Pass the user object to passport
        }
    )
); 

// Define how to serialize the user into the session, only with google_id
passport.serializeUser((gUser, done) => {
    done(null, gUser.google_id);
}); 

// Define how to deserialize the user from the session, by finding the user in the database
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

// Define routes for rendering views
app.get('/', (req, res) => {
    res.render('index');
});

// If authenticated, render the profile page with user data
// If not authenticated, redirect to the home page
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});