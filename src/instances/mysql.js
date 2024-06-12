const sequelize = require("sequelize");
const dotenv = require('dotenv');

dotenv.config();

exports.sequelize = new sequelize.Sequelize(
    process.env.MYSQL_DB,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQL_HOST,
        dialect: 'mysql',
        port: parseInt(process.env.MYSQL_PORT)
    }
);