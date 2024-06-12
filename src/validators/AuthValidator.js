const { checkSchema } = require('express-validator');

module.exports = {
    signin: checkSchema({
        email: {
            isEmail: true,
            errorMessage: 'Este E-Mail é inválido!.'
        },
        senha: {
            isLength: {
                options: { min: 2 },
                errorMessage: 'A Senha precisa ter pelo menos 2 caracteres.'
            }
        }
    }),
    signup: checkSchema({
        nome: {
            trim: true,
            isLength: {
                options: { min: 3 }
            },
            errorMessage: 'Nome precisa ter pelo menos 2 caracteres'
        },
        email: {
            isEmail: true,
            errorMessage: 'E-Mail Inválido'
        },
        senha: {
            trim: true,
            isLength: {
                options: { min: 2 }
            },
            errorMessage: 'Senha precisa ter pelo menos 2 caracteres.'
        }
    })
};