const { validationResult, matchedData } = require("express-validator");
const { fn, Op } = require("sequelize");
const Lancamento1 = require("../models/Lancamentos");
const Pedido1 = require("../models/Pedidos");
const Empresa1 = require("../models/Empresas");

const getTotalRecords = async(req, res) => {

    let filterBy = '';
    let filterVlr = '';
    if(req.body.filterBy) { filterBy = req.body.filterBy; }
    if(req.query.filterBy) { filterBy = req.query.filterBy.toString(); }
    if(req.body.filterVlr) { filterVlr = req.body.filterVlr; }
    if(req.query.filterVlr) { filterVlr = req.query.filterVlr.toString(); }

    let where = {};
    let wherePedido = {};
    let whereEmpresa = {};

    if (filterBy === 'data' && filterVlr !== '') {
        where = { 'data': filterVlr }
    }
    if (filterBy === 'Empresa.nome' && filterVlr !== '') {
        whereEmpresa = { 'nome': {[Op.like]: filterVlr} }
    }
    if (filterBy === 'Pedido.pedidocompra' && filterVlr !== '') {
        wherePedido = { 'pedidocompra': {[Op.like]: filterVlr} }
    }
    if (filterBy === 'descricao' && filterVlr !== '') {
        where = { 'descricao': {[Op.like]: filterVlr} }
    }
    if (filterBy === 'notafiscal' && filterVlr !== '') {
        where = { 'notafiscal': {[Op.like]: filterVlr} }
    }
    if (filterBy === 'faturado' && filterVlr !== '') {
        where = { 'faturado': (filterVlr==='true')?true:false }
    }
    if (filterBy === 'recebido' && filterVlr !== '') {
        where = { 'recebido': (filterVlr==='true')?true:false }
    }
    if (filterBy === 'previsao' && filterVlr !== '') {
        where = { 'previsao': filterVlr }
    }
    if (filterBy === 'recebido_em' && filterVlr !== '') {
        where = { 'recebido_em': filterVlr }
    }

    let resp = await Lancamento1.default.findAll({
        where,
        include: [{
            attributes: ['pedidocompra','responsavel','data','valor','diaspgto'],
            model: Pedido1.default,
            where: wherePedido,
            include: [{
                attributes: ['nome'],
                model: Empresa1.default,
                where: whereEmpresa
            }]
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

    let where = '';
    let wherePedido = '';
    let whereEmpresa = '';

    if (filterBy === 'data' && filterVlr !== '') {
        where = 'l.data = #' + filterVlr + '#'
    }
    if (filterBy === 'Empresa.nome' && filterVlr !== '') {
        whereEmpresa = 'e.nome LIKE "%' + filterVlr + '%"';
    }
    if (filterBy === 'Pedido.pedidocompra' && filterVlr !== '') {
        wherePedido = 'p.pedidocompra LIKE "%' + filterVlr + '%"';
    }
    if (filterBy === 'descricao' && filterVlr !== '') {
        where = 'l.descricao LIKE "%' + filterVlr + '%"';
    }
    if (filterBy === 'notafiscal' && filterVlr !== '') {
        where = 'l.notafiscal LIKE "%' + filterVlr + '%"';
    }
    if (filterBy === 'faturado' && filterVlr !== '') {
        where = 'l.faturado = ' + filterVlr;
    }
    if (filterBy === 'recebido' && filterVlr !== '') {
        where = 'l.recebido = ' + filterVlr;
    }
    if (filterBy === 'previsao' && filterVlr !== '') {
        where = 'l.previsao = #' + filterVlr + '#';
    }

    let sql = "SELECT l.id, l.PedidoId, l.data, l.descricao, l.faturado, l.recebido, l.notafiscal, l.emissao, l.previsao, l.recebido_em, p.pedidocompra, p.responsavel, p.valor, p.diaspgto, e.nome, round(l.vlr_hora * (time_to_sec(timediff(timediff(l.termino, l.inicio),l.intervalo))/3600),2) as Total ";
        sql += "FROM Lancamentos as l ";
        sql += "INNER JOIN PedidoCompras as p ON p.id = l.PedidoId ";
        sql += "INNER JOIN Empresas as e ON e.id = p.EmpresaId ";
        if (where || wherePedido || whereEmpresa) {
            sql += "WHERE " + where + wherePedido + whereEmpresa;
        }
        sql += " ORDER BY l.Data DESC";
    if (limit > 0) {
        sql += " LIMIT " + limit + " OFFSET " + start;
    }

    let resp = await Lancamento1.default.sequelize?.query(sql);

    if(resp.length > 0) {
        res.json(resp);
    } else {
        res.json({error: "Nenhum lançamento cadastrado!"});
    }
}
exports.getAll = getAll;

const getLancamento = async (req, res) => {
    if (!req.query.id && !req.body.id) {
        res.json({error: "Nenhum lancamento informado!"});
        return;
    }
    let id = 0;
    if (req.query.id) { 
        id = parseInt(req.query.id.toString());
    }
    if (req.body.id) { 
        id = parseInt(req.body.id.toString());
    }
        
    let has = await Lancamento1.default.findOne({
        where: {id}
    });

    if(has) {
        res.json(has);
    } else {
        res.status(200);
        res.json({error: 'Lançamento não encontrado!'});
    }
}
exports.getLancamento = getLancamento;

const addAction = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.json({error: errors.mapped()});
        return;
    }
    const data = matchedData(req);

    let nf = data.notafiscal;
    let dtem = data.emissao;
    let dtpv = data.previsao;
    let dtrece = data.recebido_em;

    if (nf.length === 0 || nf.toLowerCase() === 'null') { nf = null; }
    if (dtem.length !== 10 || dtem === '0000-00-00') { dtem = null; }
    if (dtpv.length !== 10 || dtpv === '0000-00-00') { dtpv = null; }
    if (dtrece.length !== 10 || dtrece === '0000-00-00') { dtrece = null; }

    const newDados = await Lancamento1.default.create({
        PedidoId: data.PedidoId,
        data: data.data,
        inicio: data.inicio,
        termino: data.termino,
        intervalo: data.intervalo,
        descricao: data.descricao,
        faturado: data.faturado,
        vlr_hora: data.vlr_hora,
        recebido: data.recebido,
        notafiscal: nf,
        emissao: dtem,
        previsao: dtpv,
        recebido_em: dtrece
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

    const resp = await Lancamento1.default.findOne({where: {id: data.id}});

    let nf = data.notafiscal;
    let dtem = data.emissao;
    let dtpv = data.previsao;
    let dtrece = data.recebido_em;

    if (nf.length === 0 || nf.toLowerCase() === 'null') { nf = null; }
    if (dtem.length !== 10 || dtem === '0000-00-00') { dtem = null; }
    if (dtpv.length !== 10 || dtpv === '0000-00-00') { dtpv = null; }
    if (dtrece.length !== 10 || dtrece === '0000-00-00') { dtrece = null; }

    let updates = {
        PedidoId: resp?.PedidoId,
        data: resp?.data,
        inicio: resp?.inicio,
        termino: resp?.termino,
        intervalo: resp?.intervalo,
        descricao: resp?.descricao,
        faturado: resp?.faturado,
        vlr_hora: resp?.vlr_hora,
        recebido: resp?.recebido,
        notafiscal: resp?.notafiscal,
        emissao: resp?.emissao,
        previsao: resp?.previsao,
        recebido_em: resp?.recebido_em
    };

    if(data.PedidoId !== updates.PedidoId) { updates.PedidoId = data.PedidoId };
    if(data.data !== updates.data) { updates.data = data.data; }
    if(data.inicio !== updates.inicio) { updates.inicio = data.inicio; }
    if(data.termino !== updates.termino) { updates.termino = data.termino };
    if(data.intervalo !== updates.intervalo) { updates.intervalo = data.intervalo };
    if(data.descricao !== updates.descricao) { updates.descricao = data.descricao };
    if(data.faturado !== updates.faturado) { updates.faturado = data.faturado };
    if(data.vlr_hora !== updates.vlr_hora) { updates.vlr_hora = data.vlr_hora };
    if(data.recebido !== updates.recebido) { updates.recebido = data.recebido };
    if(nf !== updates.notafiscal) { updates.notafiscal = nf };
    if(dtem !== updates.emissao) { updates.emissao = dtem };
    if(dtpv !== updates.previsao) { updates.previsao = dtpv };
    if(dtrece !== updates.recebido_em) { updates.recebido_em = dtrece };
    
    await Lancamento1.default.update(updates, {where: {id: data.id}});

    res.json({Lancamento1});
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
        res.json({error: 'Lançamento não informado!'});
        return;
    }

    let results = await Lancamento1.default.findAll({where: {id: data.id}});
    if(results.length > 0) {
        let resp = results[0];

        await resp.destroy();
    }
    
    res.json({});
}
exports.deleteAction = deleteAction;

const getTotalMes = async(req, res) => {
    let filtro = "";
    let faturado = "Todos";
    let recebido = "Todos";

    if (req.query.faturado) { faturado = req.query.faturado.toString(); }
    if (req.body.faturado) { faturado = req.body.faturado; }

    if (req.query.recebido) { recebido = req.query.recebido.toString(); }
    if (req.body.recebido) { recebido = req.body.recebido; }

    if (faturado !== "Todos") {
        filtro = "l.faturado=" + faturado;
    }
    if (recebido !== "Todos") {
        if(filtro !== "") { filtro += " AND "; }
        filtro += "l.recebido=" + recebido;
    }

    let ano = 0;

    if(req.body.ano && req.body.ano.length === 4) { ano = req.body.ano }
    if(req.query.ano && req.query.ano.length === 4) { ano = parseInt(req.query.ano.toString()) }

    let sql = "";
    if(faturado === "true") {
        sql = "SELECT date_format(l.previsao, '%M') as Mes, sum(round(l.vlr_hora * (time_to_sec(timediff(timediff(l.termino, l.inicio),l.intervalo))/3600),2)) as Total FROM Lancamentos as l INNER JOIN PedidoCompras as p ON p.id = l.PedidoId";
    } else {
        sql = "SELECT date_format(l.data, '%M') as Mes, sum(round(l.vlr_hora * (time_to_sec(timediff(timediff(l.termino, l.inicio),l.intervalo))/3600),2)) as Total FROM Lancamentos as l INNER JOIN PedidoCompras as p ON p.id = l.PedidoId";
    }
    if(ano > 0) {
        if(faturado === "true") {
            sql += " WHERE Year(l.previsao) = "+ ano;
        } else {
            sql += " WHERE Year(l.data) = "+ ano;
        }
        if (filtro !== "") {
            sql += " AND " + filtro;
        }
    } else {
        if (filtro !== "") {
            sql += " WHERE " + filtro;
        }
    }
    if(faturado === "true") {
        sql += " GROUP BY date_format(l.previsao, '%M') ORDER BY Month(l.previsao)"
    } else {
        sql += " GROUP BY date_format(l.data, '%M') ORDER BY Month(l.data)"
    }
    const results = await Lancamento1.default.sequelize?.query(sql);

    res.json(results);
}
exports.getTotalMes = getTotalMes;

const getTotalAno = async(req, res) => {
    let filtro = "";
    let faturado = "Todos";
    let recebido = "Todos";

    if (req.query.faturado) { faturado = req.query.faturado.toString(); }
    if (req.body.faturado) { faturado = req.body.faturado; }

    if (req.query.recebido) { recebido = req.query.recebido.toString(); }
    if (req.body.recebido) { recebido = req.body.recebido; }

    if (faturado !== "Todos") {
        filtro = "l.faturado=" + faturado;
    }
    if (recebido !== "Todos") {
        if(filtro !== "") { filtro += " AND "; }
        filtro += "l.recebido=" + recebido;
    }
    let sql = "";
    if(faturado === "true") {
        sql = "SELECT Year(l.previsao) as Ano, sum(round(l.vlr_hora * (time_to_sec(timediff(timediff(l.termino, l.inicio),l.intervalo))/3600),2)) as Total ";
    } else {
        sql = "SELECT Year(l.data) as Ano, sum(round(l.vlr_hora * (time_to_sec(timediff(timediff(l.termino, l.inicio),l.intervalo))/3600),2)) as Total ";
    }
    sql += "FROM Lancamentos as l ";
    sql += "INNER JOIN PedidoCompras as p ON p.id = l.PedidoId";
    if(filtro !== "") { sql += " WHERE "+filtro; }
    if(faturado === "true") {
        sql += " GROUP BY Year(l.previsao) ORDER BY Year(l.previsao)"
    } else {
        sql += " GROUP BY Year(l.data) ORDER BY Year(l.data)"
    }
    const results = await Lancamento1.default.sequelize?.query(sql);

    res.json(results);
}
exports.getTotalAno = getTotalAno;

const getAnos = async(req, res) => {
    let sql = "SELECT DISTINCT Year(l.data) as Ano FROM Lancamentos as l ORDER BY Year(l.data) DESC"
    const results = await Lancamento1.default.sequelize?.query(sql);

    res.json(results);
}
exports.getAnos = getAnos;