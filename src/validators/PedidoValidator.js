const { checkSchema } = require('express-validator');

module.exports = {
    addAction: checkSchema({
        EmpresaId: {
            isNumeric:true,
            notEmpty: true,
            errorMessage: 'Empresa não informada.'
        },
        pedidocompra: {
            isNumeric:true,
            notEmpty:true,            
            errorMessage: 'Pedido de Compras não informado.'
        },
        responsavel: {
            trim: true,
            isLength: {
                options: { min: 3 }
            },
            errorMessage: 'Responsável precisa ter pelo menos 3 caracteres.'
        },
        data: {
            isDate: true,
            notEmpty: true,
            errorMessage: 'Data não informada.'
        },
        valor: {
            isFloat: true,
            notEmpty: true,
            errorMessage: 'Valor do pedido não informado!'
        },
        diaspgto: {
            isNumeric: true,
            notEmpty: true,
            errorMessage: "Dias para pagamento não informado."
        }
    }),
    editAction: checkSchema({
        id: {
            isNumeric: true,
            notEmpty: true,
            errorMessage: 'ID não informado.'
        },
        EmpresaId: {
            isNumeric:true,
            notEmpty: true,
            errorMessage: 'Empresa não informada.'
        },
        pedidocompra: {
            isNumeric:true,
            notEmpty:true,            
            errorMessage: 'Pedido de Compras não informado.'
        },
        responsavel: {
            trim: true,
            isLength: {
                options: { min: 3 }
            },
            errorMessage: 'Responsável precisa ter pelo menos 3 caracteres.'
        },
        data: {
            isDate: true,
            notEmpty: true,
            errorMessage: 'Data não informada.'
        },
        valor: {
            isFloat: true,
            notEmpty: true,
            errorMessage: 'Valor do pedido não informado!'
        },
        diaspgto: {
            isNumeric: true,
            notEmpty: true,
            errorMessage: "Dias para pagamento não informado."
        }
    }),
    deleteAction: checkSchema({
        id: {
            isNumeric: true,
            notEmpty: true,
            errorMessage: 'ID não informado.'
        },
    })
};