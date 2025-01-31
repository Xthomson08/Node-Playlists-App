const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false, // Disable query logging
    }
);

// Import models
const User = require('./models/user')(sequelize);
const Playlist = require('./models/playlist')(sequelize);
const Song = require('./models/song')(sequelize);

// Define associations
User.hasMany(Playlist, {
    foreignKey: 'user_id',
    as: 'playlists',
});

Playlist.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
});

Playlist.hasMany(Song, {
    foreignKey: 'playlist_id',
    as: 'songs',
});

Song.belongsTo(Playlist, {
    foreignKey: 'playlist_id',
    as: 'playlist',
});

// Sync all models
sequelize.sync({ alter: true });

module.exports = { sequelize, User, Playlist, Song };