const { validationResult, matchedData } = require("express-validator");
const md5 = require("md5");
const { Op } = require("sequelize");
const { User } = require("../models/Users");

const signin = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.json({error: errors.mapped()});
        return;
    }

    const data = matchedData(req);

    let usuario = await User.findOne({
        where: {
                [Op.and]: [{email: data.email},
                           {senha: data.senha}] 
        }
    });

    if(!usuario) {
        res.json({error: 'E-Mail/Senha Inválido!'});
        return;
    }

    res.json(usuario);
}
exports.signin = signin;

const signup = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.json({error: errors.mapped()});
        return;
    }
    const data = matchedData(req);
    
    let usuario = await User.findOne({
        where: {email: data.email}
    });

    if(usuario) {
        res.json({error: {email: {msg: 'E-Mail já existe!'}}});
        return;
    }

    const payload = (Date.now() + Math.random()).toString();
    const token = md5(payload);

    const newUser = await User.create({
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        token
    });

    await newUser.save;

    res.json({token});
}
exports.signup = signup;