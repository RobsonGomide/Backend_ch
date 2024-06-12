const sequelize1 = require('sequelize');
const mysql = require('../instances/mysql');
const Empresa = require('./Empresas');

const Pedido = mysql.sequelize.define("Pedido", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize1.DataTypes.INTEGER
    },
    EmpresaId: { type: sequelize1.DataTypes.INTEGER },
    pedidocompra: { type: sequelize1.DataTypes.STRING },
    responsavel: { type: sequelize1.DataTypes.STRING },
    data: { type: sequelize1.DataTypes.DATEONLY },
    valor: { type: sequelize1.DataTypes.FLOAT },
    diaspgto: { type: sequelize1.DataTypes.INTEGER }
}, {
    tableName: 'PedidoCompras',
    timestamps: false
});
Pedido.belongsTo(Empresa.default, {foreignKey: 'EmpresaId'});
Pedido.sync();
exports.default = Pedido;