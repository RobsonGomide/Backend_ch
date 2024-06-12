const { validationResult, matchedData } = require("express-validator");
const { Op } = require("sequelize");
const { User } = require("../models/Users");

const getAll = async (req, res) => {
    let users = await User.findAll({ order: ['nome']});
    if(users.length > 0) {
        res.json(users);
    } else {
        res.json({Error: "Nenhum usuário cadastrado!"});
    }
}
exports.getAll = getAll;

const getUser = async (req, res) => {
    if (!req.query.token && !req.body.token) {
        res.json({Error: "Nenhum usuário informado!"});
        return;
    }
    let token = "";
    if (req.query.token) { 
        token = req.query.token.toString();
    }
    if (req.body.token) { 
        token = req.body.token;
    }
    let hasUser = await User.findOne({where: {token}});
    if(hasUser) {
        res.json(hasUser);
    } else {
        res.status(200);
        res.json({error: 'Usuário não encontrado!'});
    }
}
exports.getUser = getUser;

const editAction = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.json({error: errors.mapped()});
        return;
    }
    const data = matchedData(req);

    if(data.email) {
        const findEmail = await User.findOne(
            {where: {
                email: data.email,
                token: {[Op.not] : data.token},
                }
            }
        );
        if(findEmail) {
            res.json({Error: 'Este E-mail já está cadastrado em outro usuário!'});
            return;
        }
    }

    const user = await User.findOne({where: {token: data.token}});

    let updates = {
        nome: user?.nome,
        email: user?.email,
        senha: user?.senha
    };

    if(data.nome) { updates.nome = data.nome; }
    if(data.email) { updates.email = data.email; }
    if(data.senha && data.senha !== '') { updates.senha = data.senha; }
    
    await User.update(updates, {where: {token: data.token}});

    res.json(data.token);
}
exports.editAction = editAction;

const deleteAction = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.json({error: errors.mapped()});
        return;
    }
    const data = matchedData(req);

    if(!data.token) {
        res.json({error: 'Usuário não informado!'});
        return;
    }

    let results = await User.findAll({where: {token: data.token}});
    if(results.length > 0) {
        let usuario = results[0];

        await usuario.destroy();
    }
    
    res.json({});
}
exports.deleteAction = deleteAction;