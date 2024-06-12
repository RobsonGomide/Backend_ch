const sequelize1 = require('sequelize');
const mysql = require('../instances/mysql');
const Pedido = require('./Pedidos');

const Lancamento = mysql.sequelize.define("Lancamento", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize1.DataTypes.INTEGER
    },
    PedidoId: { type: sequelize1.DataTypes.INTEGER },
    data: { type: sequelize1.DataTypes.DATEONLY },
    inicio: { type: sequelize1.DataTypes.TIME },
    termino: { type: sequelize1.DataTypes.TIME },
    intervalo: { type: sequelize1.DataTypes.TIME },
    descricao: { type: sequelize1.DataTypes.STRING },
    faturado: { type: sequelize1.DataTypes.BOOLEAN },
    vlr_hora: { type: sequelize1.DataTypes.FLOAT },
    recebido: { type: sequelize1.DataTypes.BOOLEAN },
    notafiscal: { type: sequelize1.DataTypes.STRING },
    emissao: { type: sequelize1.DataTypes.DATEONLY },
    previsao: { type: sequelize1.DataTypes.DATEONLY },
    recebido_em: { type: sequelize1.DataTypes.DATEONLY }
}, {
    tableName: 'Lancamentos',
    timestamps: false
});
Lancamento.sync();
Lancamento.belongsTo(Pedido.default, {foreignKey: 'PedidoId'});
exports.default = Lancamento;
