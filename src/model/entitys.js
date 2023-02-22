import connection from './connection.js';
import Sequelize from 'sequelize';

const Serie = connection.define('serie', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    fansub: {
        type: Sequelize.STRING,
        allowNull: false
    },
    day: {
        type: Sequelize.STRING,
        allowNull: false
    },
    leng: {
        type: Sequelize.STRING,
        allowNull: false
    },
    quality: {
        type: Sequelize.STRING,
        allowNull: false
    },
    source: {
        type: Sequelize.STRING,
        allowNull: false
    },
    internalName: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

const Episode = connection.define('episode', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Serie.hasMany(Episode);
Episode.belongsTo(Serie);

connection.sync();

export { Serie, Episode };