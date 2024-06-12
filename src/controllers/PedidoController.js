const { validationResult, matchedData } = require("express-validator");
const { Op } = require("sequelize");
const Pedido = require("../models/Pedidos");
const Empresa = require("../models/Empresas");

const getTotalRecords = async(req, res) => {

    let filterBy = '';
    let filterVlr = '';
    if(req.body.filterBy) { filterBy = req.body.filterBy; }
    if(req.query.filterBy) { filterBy = req.query.filterBy.toString(); }
    if(req.body.filterVlr) { filterVlr = req.body.filterVlr; }
    if(req.query.filterVlr) { filterVlr = req.query.filterVlr.toString(); }

    let wherePedido = {};
    let whereEmpresa = {};
    if (filterBy === 'data' && filterVlr !== '') {
        wherePedido = { 'data': filterVlr }
    }
    if (filterBy === 'Empresa.nome' && filterVlr !== '') {
        whereEmpresa = { 'nome': {[Op.like]: filterVlr} }
    }
    if (filterBy === 'pedidocompra' && filterVlr !== '') {
        wherePedido = { 'pedidocompra': {[Op.like]: filterVlr} }
    }
    if (filterBy === 'responsavel' && filterVlr !== '') {
        wherePedido = { 'responsavel': {[Op.like]: filterVlr} }
    }

    let resp = await Pedido.default.findAll({
        where: wherePedido,
        include: [{
            model: Empresa.default,
            where: whereEmpresa
        }]
    });
    res.json(resp.length);
}
exports.getTotalRecords = getTotalRecords;

const getAll = async (req, res) => {
    let limit = 0;
    let start = 0;
    if(req.body.limit) { limit = parseInt(req.body.limit.toString()) }
    if(req.query.limit) { limit = parseInt(req.query.limit.toString()) }
    if(req.body.start) { start = parseInt(req.body.start.toString()) }
    if(req.query.start) { start = parseInt(req.query.start.toString()) }
    
    let filterBy = '';
    let filterVlr = '';
    if(req.body.filterBy) { filterBy = req.body.filterBy; }
    if(req.query.filterBy) { filterBy = req.query.filterBy.toString(); }
    if(req.body.filterVlr) { filterVlr = req.body.filterVlr; }
    if(req.query.filterVlr) { filterVlr = req.query.filterVlr.toString(); }

    let wherePedido = {};
    let whereEmpresa = {};

    if (filterBy === 'data' && filterVlr !== '') {
        wherePedido = { 'data': filterVlr }
    }
    if (filterBy === 'Empresa.nome' && filterVlr !== '') {
        whereEmpresa = { 'nome': {[Op.like]: filterVlr} }
    }
    if (filterBy === 'pedidocompra' && filterVlr !== '') {
        wherePedido = { 'pedidocompra': {[Op.like]: filterVlr} }
    }
    if (filterBy === 'responsavel' && filterVlr !== '') {
        wherePedido = { 'responsavel': {[Op.like]: filterVlr} }
    }

    let resp = await Pedido.default.findAll({
        where: wherePedido,
        order: [[Empresa.default,'nome'], ['data', 'DESC']],
        include: [{
            attributes: ['nome'],
            model: Empresa.default,
            where: whereEmpresa
        }]

    })

    if(limit > 0) {
        resp = await Pedido.default.findAll({
            where: wherePedido,
            order: [[Empresa.default,'nome'], ['data', 'DESC']],
            include: [{
                attributes: ['nome'],
                model: Empresa.default,
                where: whereEmpresa
            }],
            limit: limit,
            offset: start
        })
    }

    if(resp.length > 0) {
        res.json(resp);
    } else {
        res.json({error: "Nenhum pedido de compras cadastrado!"});
    }
}
exports.getAll = getAll;

const getPedido = async (req, res) => {
    if (!req.query.id && !req.body.id) {
        res.json({error: "Nenhum pedido de compra informado!"});
        return;
    }
    let id = 0;
    if (req.query.id) { 
        id = parseInt(req.query.id.toString());
    }
    if (req.body.id) { 
        id = parseInt(req.body.id.toString());
    }
        
    let has = await Pedido.default.findOne({
        where: {id}
    });

    if(has) {
        res.json(has);
    } else {
        res.status(200);
        res.json({error: 'Pedido de compra não encontrado!'});
    }
}
exports.getPedido = getPedido;

const getSaldoPedidos = async(req, res) => {
    let sql = "SELECT p.*, e.cpfcnpj, e.nome as empresa, (p.valor - sum(round(l.vlr_hora * (time_to_sec(timediff(timediff(l.termino, l.inicio),l.intervalo))/3600),2))) as Saldo ";
    sql += "FROM PedidoCompras as p ";
    sql += "INNER JOIN Lancamentos as l ON l.PedidoId = p.id ";
    sql += "INNER JOIN Empresas as e ON e.id = p.EmpresaId ";
    sql += "Group By p.pedidocompra ";
    sql += "ORDER BY e.nome, p.data";
    const results = await Pedido.default.sequelize?.query(sql);

    res.json(results);
}
exports.getSaldoPedidos = getSaldoPedidos;

const addAction = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.json({error: errors.mapped()});
        return;
    }
    const data = matchedData(req);
    
    let resp = await Pedido.default.findOne({
        where: {pedidocompra: data.pedidocompra}
    });

    if(resp) {
        res.json({error: 'Pedido de Compra já existe!'});
        return;
    }

    const newDados = await Pedido.default.create({
        EmpresaId: data.EmpresaId,
        pedidocompra: data.pedidocompra,
        responsavel: data.responsavel,
        data: data.data,
        valor: data.valor,
        diaspgto: data.diaspgto
    });

    await newDados.save;

    res.json({newDados});
}
exports.addAction = addAction;

const editAction = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.json({error: errors.mapped()});
        return;
    }
    const data = matchedData(req);

    if(data.pedidocompra) {
        const findPedido = await Pedido.default.findOne(
            {where: {
                pedidocompra: data.pedidocompra,
                id: {[Op.not] : data.id},
                }
            }
        );
        if(findPedido) {
            res.json({error: 'Este pedido de compra já está cadastrado!'});
            return;
        }
    }

    const resp = await Pedido.default.findOne({where: {id: data.id}});

    let updates = {
        EmpresaId: resp?.EmpresaId,
        pedidocompra: resp?.pedidocompra,
        responsavel: resp?.responsavel,
        data: resp?.data,
        valor: resp?.valor,
        diaspgto: resp?.diaspgto
    };

    if(data.EmpresaId) { updates.EmpresaId = data.EmpresaId };
    if(data.pedidocompra) { updates.pedidocompra = data.pedidocompra; }
    if(data.responsavel) { updates.responsavel = data.responsavel; }
    if(data.data) { updates.data = data.data };
    if(data.valor) { updates.valor = data.valor };
    if(data.diaspgto) { updates.diaspgto = data.diaspgto };
    
    await Pedido.default.update(updates, {where: {id: data.id}});

    res.json({Pedido});
}
exports.editAction = editAction;

const deleteAction = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.json({error: errors.mapped()});
        return;
    }
    const data = matchedData(req);

    if(!data.id) {
        res.json({error: 'Pedido não informado!'});
        return;
    }

    let results = await Pedido.default.findAll({where: {id: data.id}});
    if(results.length > 0) {
        let resp = results[0];

        await resp.destroy();
    }
    
    res.json({});
}
exports.deleteAction = deleteAction;