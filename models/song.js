const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Song = sequelize.define('Song', {
        playlist_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
    });

    return Song;
};