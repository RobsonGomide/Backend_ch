const { checkSchema } = require('express-validator');

module.exports = {
    addAction: checkSchema({
        cpfcnpj: {
            trim: true,
            isLength: {
                options: { min: 15, max: 18 }
            },
            errorMessage: 'O CPF/CNPJ tem que ter 15 ou 18 caracteres'
        },
        nome: {
            trim: true,
            isLength: {
                options: { min: 3 }
            },
            errorMessage: 'Nome precisa ter pelo menos 3 caracteres'
        },
        municipio: {
            trim: true,
            isLength: {
                options: { min: 3 }
            },
            errorMessage: 'Município precisa ter pelo menos 3 caracteres.'
        }
    }),
    editAction: checkSchema({
        id: {
            notEmpty: true,
            errorMessage: 'ID não informado.'
        },
        cpfcnpj: {
            optional: true,
            trim: true,
            isLength: {
                options: { min: 15, max: 18 }
            },
            errorMessage: 'O CPF/CNPJ tem que ter 15 ou 18 caracteres'
        },
        nome: {
            optional: true,
            trim: true,
            isLength: {
                options: { min: 3 }
            },
            errorMessage: 'Nome precisa ter pelo menos 3 caracteres'
        },
        municipio: {
            optional: true,
            trim: true,
            isLength: {
                options: { min: 3 }
            },
            errorMessage: 'Município precisa ter pelo menos 3 caracteres.'
        }
    }),
    deleteAction: checkSchema({
        cpfcnpj: {
            notEmpty: true,
            errorMessage: 'Informe o CPF/CNPJ.'
        }
    })
};