const express = require('express');
const { Playlist, Song } = require('../db');

const router = express.Router();

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

// Get all playlists for the authenticated user
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const playlists = await Playlist.findAll({
            where: { user_id: req.user.id },
            include: [{ model: Song, as: 'songs' }],
        });
        res.render('playlists', { user: req.user, playlists });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Create a new playlist
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const { name } = req.body;
        await Playlist.create({
            user_id: req.user.id,
            name,
        });
        res.redirect('/playlists');
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get the edit playlist view
router.get('/:id/edit', isAuthenticated, async (req, res) => {
    try {
        const playlist = await Playlist.findOne({
            where: { id: req.params.id, user_id: req.user.id },
            include: [{ model: Song, as: 'songs' }],
        });
        if (!playlist) {
            return res.status(404).send('Playlist not found');
        }
        res.render('editPlaylist', { user: req.user, playlist });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Add a song to the playlist
router.post('/:id/add-song', isAuthenticated, async (req, res) => {
    try {
        const { title, artist, url } = req.body;
        const playlist = await Playlist.findOne({
            where: { id: req.params.id, user_id: req.user.id },
        });
        if (!playlist) {
            return res.status(404).send('Playlist not found');
        }
        await Song.create({
            playlist_id: playlist.id,
            title,
            artist,
            url,
        });
        res.redirect(`/playlists/${playlist.id}/edit`);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get the view playlist view
router.get('/:id/view', isAuthenticated, async (req, res) => {
    try {
        const playlist = await Playlist.findOne({
            where: { id: req.params.id, user_id: req.user.id },
            include: [{ model: Song, as: 'songs' }],
        });
        if (!playlist) {
            return res.status(404).send('Playlist not found');
        }
        res.render('viewPlaylist', { user: req.user, playlist });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;