const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Song = sequelize.define('Song', {
        playlist_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'Playlists',
                key: 'id',
            },
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        artist: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        profile_image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });

    return Song;
};