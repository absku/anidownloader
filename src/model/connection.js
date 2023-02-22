import Sequelize from "sequelize";

const sequelize = new Sequelize('anidownloader', '', '', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: './db/anidownloader.sqlite',
    logging: false
})

export default sequelize;