const { checkSchema } = require('express-validator');

module.exports = {
    addAction: checkSchema({
        PedidoId: {
            isNumeric: true,
            notEmpty: true,
            errorMessage: 'Pedido de compras não informado.'
        },
        data: {
            isDate: true,
            notEmpty: true,
            errorMessage: 'Data não informada.'
        },
        inicio: {
            notEmpty: true,
            errorMessage: 'Início não informado.'
        },
        termino: {
            notEmpty: true,
            errorMessage: 'Término não informado.'
        },
        intervalo: {
            notEmpty: true,
            errorMessage: 'Intervalo não informado.'
        },
        descricao: {
            trim: true,
            notEmpty: true,
            errorMessage: 'Descrição não informada.'
        },
        faturado: {
            isBoolean: true
        },
        vlr_hora: {
            isFloat: true,
            notEmpty: false,
            errorMessage: 'Valor da hora não informado.'
        },
        recebido: {
            isBoolean: true
        },
        notafiscal: {
            trim: true,
            isString: true,
            notEmpty: false,
            errorMessage: 'Nota fiscal não informada.'
        },
        emissao: {
            notEmpty: false,
            errorMessage: 'Data de emissão da nota fiscal não informada.'
        },
        previsao: {
            notEmpty: false,
            errorMessage: 'Previsão de pagamento não informado.'
        },
        recebido_em: {
            notEmpty: false,
            errorMessage: 'Data de recebimento inválida.'
        }
    }),
    editAction: checkSchema({
        id: {
            notEmpty: true,
            errorMessage: 'ID não informado.'
        },
        PedidoId: {
            isNumeric: true,
            notEmpty: true,
            errorMessage: 'Pedido de compras não informado.'
        },
        data: {
            isDate: true,
            notEmpty: true,
            errorMessage: 'Data não informada.'
        },
        inicio: {
            notEmpty: true,
            errorMessage: 'Início não informado.'
        },
        termino: {
            notEmpty: true,
            errorMessage: 'Término não informado.'
        },
        intervalo: {
            notEmpty: true,
            errorMessage: 'Intervalo não informado.'
        },
        descricao: {
            trim: true,
            notEmpty: true,
            errorMessage: 'Descrição não informada.'
        },
        faturado: {
            isBoolean: true
        },
        vlr_hora: {
            isFloat: true,
            notEmpty: false,
            errorMessage: 'Valor da hora não informado.'
        },
        recebido: {
            isBoolean: true
        },
        notafiscal: {
            trim: true,
            isString: true,
            errorMessage: 'Nota fiscal não informada.'
        },
        emissao: {
        },
        previsao: {
        },
        recebido_em: {
        }
    }),
    deleteAction: checkSchema({
        id: {
            notEmpty: true,
            errorMessage: 'ID não informado.'
        }
    })
};