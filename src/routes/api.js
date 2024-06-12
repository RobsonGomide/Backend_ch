const express1 = require('express');

const Auth = require('../middlewares/Auth');
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');
const EmpresaController = require('../controllers/EmpresaController');
const PedidoController = require('../controllers/PedidoController');
const LancamentoController = require('../controllers/LancamentoController');

const AuthValidator = require('../validators/AuthValidator');
const UserValidator = require('../validators/UserValidator');
const EmpresaValidator = require('../validators/EmpresaValidator');
const PedidoValidator = require('../validators/PedidoValidator');
const LancamentoValidator = require('../validators/LancamentoValidator');

const router = (0, express1.Router)();

router.get('/user/lista', Auth.private, UserController.getAll);

router.post('/user/signin', AuthValidator.signin, AuthController.signin);
router.post('/user/signup', AuthValidator.signup, AuthController.signup);

router.get('/user/me', Auth.private, UserController.getUser);
router.put('/user/me', Auth.private, UserValidator.editAction, UserController.editAction);
router.delete('/user/delete', UserValidator.deleteAction, Auth.private, UserController.deleteAction);

router.get('/empresa/totreg', Auth.private, EmpresaController.getTotalRecords);
router.get('/empresa/lista', Auth.private, EmpresaController.getAll);
router.get('/empresa/me',Auth.private, EmpresaValidator.deleteAction, EmpresaController.getEmpresa);
router.post('/empresa/novo', Auth.private, EmpresaValidator.addAction, EmpresaController.addAction);
router.put('/empresa/alterar', Auth.private, EmpresaValidator.editAction, EmpresaController.editAction);
router.delete('/empresa/excluir', Auth.private, EmpresaValidator.deleteAction, EmpresaController.deleteAction);

router.get('/pedido/totreg', Auth.private, PedidoController.getTotalRecords);
router.get('/pedido/lista', Auth.private, PedidoController.getAll);
router.get('/pedido/me',Auth.private, PedidoValidator.deleteAction, PedidoController.getPedido);
router.post('/pedido/novo', Auth.private, PedidoValidator.addAction, PedidoController.addAction);
router.put('/pedido/alterar', Auth.private, PedidoValidator.editAction, PedidoController.editAction);
router.delete('/pedido/excluir', Auth.private, PedidoValidator.deleteAction, PedidoController.deleteAction);
router.get('/pedido/saldopedidos', Auth.private, PedidoController.getSaldoPedidos);

router.get('/lancamento/totreg', Auth.private, LancamentoController.getTotalRecords);
router.get('/lancamento/lista', Auth.private, LancamentoController.getAll);
router.get('/lancamento/me',Auth.private, LancamentoValidator.deleteAction, LancamentoController.getLancamento);
router.post('/lancamento/novo', Auth.private, LancamentoValidator.addAction, LancamentoController.addAction);
router.put('/lancamento/alterar', Auth.private, LancamentoValidator.editAction, LancamentoController.editAction);
router.delete('/lancamento/excluir', Auth.private, LancamentoValidator.deleteAction, LancamentoController.deleteAction);
router.get('/lancamento/gettotalmes', Auth.private, LancamentoController.getTotalMes);
router.get('/lancamento/gettotalano', Auth.private, LancamentoController.getTotalAno);
router.get('/lancamento/getanos', Auth.private, LancamentoController.getAnos);

module.exports = router;