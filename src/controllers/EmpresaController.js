const { validationResult, matchedData } = require("express-validator");
const { Op } = require("sequelize");
const Empresa1 = require("../models/Empresas");

const getTotalRecords = async(req, res) => {
    let empresas = await Empresa1.default.findAll();
    res.json(empresas.length);
}
exports.getTotalRecords = getTotalRecords;

const getAll = async (req, res) => {
    let limit = 0;
    let start = 0;
    if(req.body.limit) { limit = parseInt(req.body.limit.toString()) }
    if(req.query.limit) { limit = parseInt(req.query.limit.toString()) }
    if(req.body.start) { start = parseInt(req.body.start.toString()) }
    if(req.query.start) { start = parseInt(req.query.start.toString()) }

    let empresas = await Empresa1.default.findAll({order: ['nome']});

    if(limit > 0) {
        empresas = await Empresa1.default.findAll({
            order: ['nome'],
            limit: limit,
            offset: start
        })
    }

    if(empresas.length > 0) {
        res.json(empresas);
    } else {
        res.json({error: "Nenhuma empresa cadastrada!"});
    }
}
exports.getAll = getAll;

const getEmpresa = async (req, res) => {
    if (!req.query.cpfcnpj && !req.body.cpfcnpj) {
        res.json({error: "Nenhuma empresa informada!"});
        return;
    }
    let cpfcnpj = "";
    if (req.query.cpfcnpj) { 
        cpfcnpj = req.query.cpfcnpj.toString();
    }
    if (req.body.cpfcnpj) { 
        cpfcnpj = req.body.cpfcnpj;
    }
    let hasEmpresa = await Empresa1.default.findOne({where: {cpfcnpj}});
    if(hasEmpresa) {
        res.json(hasEmpresa);
    } else {
        res.status(200);
        res.json({error: 'Empresa não encontrada!'});
    }
}
exports.getEmpresa = getEmpresa;

const addAction = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.json({error: errors.mapped()});
        return;
    }
    const data = matchedData(req);
    
    let empresa = await Empresa1.default.findOne({
        where: {cpfcnpj: data.cpfcnpj}
    });

    if(empresa) {
        res.json({error: 'CPF/CNPJ já existe!'});
        return;
    }

    const newEmpresa = await Empresa1.default.create({
        cpfcnpj: data.cpfcnpj,
        nome: data.nome,
        municipio: data.municipio
    });

    await newEmpresa.save;

    res.json({newEmpresa});
}
exports.addAction = addAction;

const editAction = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.json({error: errors.mapped()});
        return;
    }
    const data = matchedData(req);

    if(data.cpfcnpj) {
        const findEmail = await Empresa1.default.findOne(
            {where: {
                cpfcnpj: data.cpfcnpj,
                id: {[Op.not] : data.id},
                }
            }
        );
        if(findEmail) {
            res.json({error: 'Este CPF/CNPJ já está cadastrado em outra empresa!'});
            return;
        }
    }

    const empresa = await Empresa1.default.findOne({where: {cpfcnpj: data.cpfcnpj}});

    let updates = {
        cpfcnpj: empresa?.cpfcnpj,
        nome: empresa?.nome,
        municipio: empresa?.municipio
    };

    if(data.cpfcnpj) { updates.cpfcnpj = data.cpfcnpj };
    if(data.nome) { updates.nome = data.nome; }
    if(data.municipio) { updates.municipio = data.municipio; }
    
    await Empresa1.default.update(updates, {where: {id: data.id}});

    res.json({Empresa1});
}
exports.editAction = editAction;

const deleteAction = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.json({error: errors.mapped()});
        return;
    }
    const data = matchedData(req);

    if(!data.cpfcnpj) {
        res.json({error: 'Empresa não informada!'});
        return;
    }

    let results = await Empresa1.default.findAll({where: {cpfcnpj: data.cpfcnpj}});
    if(results.length > 0) {
        let empresa = results[0];

        await empresa.destroy();
    }
    
    res.json({});
}
exports.deleteAction = deleteAction;