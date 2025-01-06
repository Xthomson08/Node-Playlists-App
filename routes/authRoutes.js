const express = require('express');
const passport = require('passport');
const router = express.Router();

// Route to authenticate with Google
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Route to handle Google's response
router.get(
    '/google/callback',
    passport.authenticate('google', {
        successRedirect: '/profile',
        failureRedirect: '/',
    })
);

// Route to handle logout
router.get(
    '/logout',
    (req, res, next) => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
    }
);

module.exports = router;