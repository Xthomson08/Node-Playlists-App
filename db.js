// Highly commented as this is a learning project.

/*
This is the main database file for the application.
It sets up the Sequelize ORM (Object-Relational Mapping) to connect to a PostgreSQL database
and defines the models and their associations.
*/

const { Sequelize } = require('sequelize'); // Import Sequelize for database connection
require('dotenv').config(); // Load environment variables from .env file

// Create a new Sequelize instance to connect to the PostgreSQL database
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres', // Specify the database dialect (PostgreSQL in this case)
        logging: false, // Disable query logging in console
    }
);

// Import models
const User = require('./models/user')(sequelize); // User model for authentication and user data
const Playlist = require('./models/playlist')(sequelize); // Playlist model for user playlists
const Song = require('./models/song')(sequelize); // Song model for songs in playlists

// Define model associations

// User can have many playlists
User.hasMany(Playlist, {
    foreignKey: 'user_id',
    as: 'playlists',
});

// Playlist belongs to a user
Playlist.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
});

// Playlist can have many songs
Playlist.hasMany(Song, {
    foreignKey: 'playlist_id',
    as: 'songs',
});

// Song belongs to a playlist
Song.belongsTo(Playlist, {
    foreignKey: 'playlist_id',
    as: 'playlist',
});

/* 
Sync all models: this creates the tables in the database if they don't exist and alters them if they do
(Alter should be used with caution in production, as it can lead to data loss when database schema changes)
*/
sequelize.sync({ alter: true });

module.exports = { sequelize, User, Playlist, Song }; // Export the sequelize instance and models for use in other files