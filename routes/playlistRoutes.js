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

// Helper functions
function isYouTubeURL(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return regex.test(url);
}

function extractYouTubeID(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
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

// Add a song to the playlist
router.post('/:id/add-song', isAuthenticated, async (req, res) => {
    try {
        const { title, artist, url, profileImage } = req.body;
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
            profile_image: profileImage || null, // Add this field to your Song model if it doesn't exist
        });
        res.status(200).send('Song added successfully');
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Edit a song in the playlist
router.post('/:id/edit-song/:songId', isAuthenticated, async (req, res) => {
    try {
        const { title, artist, url } = req.body;
        const song = await Song.findOne({
            where: { id: req.params.songId, playlist_id: req.params.id },
        });
        if (!song) {
            return res.status(404).send('Song not found');
        }
        await song.update({ title, artist, url });
        res.redirect(`/playlists/${req.params.id}/edit`);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete a song from the playlist
router.post('/:id/delete-song/:songId', isAuthenticated, async (req, res) => {
    try {
        const song = await Song.findOne({
            where: { id: req.params.songId, playlist_id: req.params.id },
        });
        if (!song) {
            return res.status(404).send('Song not found');
        }
        await song.destroy();
        res.redirect(`/playlists/${req.params.id}/edit`);
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
        res.render('viewPlaylist', { user: req.user, playlist, isYouTubeURL, extractYouTubeID });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;