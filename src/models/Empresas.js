const sequelize = require('sequelize');
const mysql = require('../instances/mysql');

const Empresa = mysql.sequelize.define("Empresa", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize.DataTypes.INTEGER
    },
    cpfcnpj: { type: sequelize.DataTypes.STRING },
    nome: { type: sequelize.DataTypes.STRING },
    municipio: { type: sequelize.DataTypes.STRING },
}, {
    tableName: 'Empresas',
    timestamps: false
});
Empresa.sync();
exports.default = Empresa;
