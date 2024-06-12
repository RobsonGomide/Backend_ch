const sequelize1 = require('sequelize');
const mysql = require('../instances/mysql');

exports.User = mysql.sequelize.define("User", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize1.DataTypes.INTEGER
    },
    nome: { type: sequelize1.DataTypes.STRING },
    email: { type: sequelize1.DataTypes.STRING },
    senha: { type: sequelize1.DataTypes.STRING },
    token: { type: sequelize1.DataTypes.STRING }
}, {
    tableName: 'Users',
    timestamps: false
});
