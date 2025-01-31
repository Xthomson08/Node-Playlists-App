const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Playlist = sequelize.define('Playlist', {
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    });

    return Playlist;
};