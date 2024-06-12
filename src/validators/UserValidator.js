const { checkSchema } = require('express-validator');

module.exports = {
    editAction: checkSchema({
        nome: {
            optional: true,
            trim: true,
            isLength: {
                options: { min: 3 }
            },
            errorMessage: 'Nome precisa ter pelo menos 3 caracteres'
        },
        email: {
            optional: true,
            isEmail: true,
            errorMessage: 'E-Mail Inválido'
        },
        senha: {
            optional: true,
            trim: true,
            notEmpty: true,
            errorMessage: 'Senha precisa ser preenchida.'
        },
        token: {
            notEmpty: true,
            errorMessage: "Falho no token."
        }
    }),
    deleteAction: checkSchema({
        token: {
            notEmpty: true,
            errorMessage: 'Informe o usuário.'
        }
    })
};