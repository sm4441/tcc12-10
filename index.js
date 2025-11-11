const express = require('express');
const cors = require('cors');

const app = express();

// -------------------- Middleware --------------------
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// -------------------- Imports --------------------
// Candidato
const { buscarClientes } = require('./src/DAO/cliente/buscarClientes.js');
const { inserirCandidato } = require('./src/DAO/cliente/addUsuario.js');
const { deletarUsuario } = require('./src/DAO/cliente/deliteCliente.js');
const { editarCliente } = require('./src/DAO/cliente/editarCliente.js');
const { candidatar } = require('./src/DAO/cliente/caditarse.js');

// Empresa
const { inserirEmpresa } = require('./src/DAO/Empresa/addEmpresa.js');
const { buscarEmpresa } = require('./src/DAO/Empresa/buscarEmpresa.js');
const { deletarEmpresa } = require('./src/DAO/Empresa/deletEmpresa.js');
const { editarEmpresa } = require('./src/DAO/Empresa/editarEmpresa.js');
const { marcarNotificacaoComoLida, listarNotificacoesPorEmpresa } = require('./src/DAO/Empresa/notificação.js');
const { authEmpresa } = require('./src/DAO/middleware/authEmpresa.js');

// Vaga
const { inserirVaga } = require('./src/DAO/vaga/addVaga.js');
const { editarVaga } = require('./src/DAO/vaga/aditarVaga.js');
const { buscarVaga } = require('./src/DAO/vaga/buscarVaga.js');
const { deletarVaga } = require('./src/DAO/vaga/deliteVaga.js');
const { buscarVagasPorPerfil } = require('./src/DAO/vaga/vagas_perfil.js');

// Login
const { login } = require('./src/DAO/login.js');
const { autenticarToken } = require('./src/DAO/middleware/authMiddleware.js');

// Banco
const { testarConexao } = require('./src/DAO/conexao.js');


// -------------------- Rotas --------------------
app.get('/tcc/v1', (req, res) => {
    res.json({ msg: "Aplicação Funcionando tcc" });
});


// ---------- Candidato ----------
app.get('/tcc/busca', async (req, res) => {
    res.json(await buscarClientes());
});

app.post('/tcc/add_usuario', async (req, res) => {
    const { cpf, telefone, nome_completo, email, id_endereco, id_status, senha, limite, is_pcd } = req.body;

    if (!cpf || !nome_completo || !telefone || !email || !limite || id_endereco == null || id_status == null || !senha) {
        return res.status(400).json({ mensagem: "Dados incompletos." });
    }

    const resultado = await inserirCandidato(cpf, nome_completo, telefone, email, id_endereco, id_status, senha, limite, is_pcd ?? false);
    res.status(resultado.sucesso ? 201 : 500).json(resultado);
});

app.delete('/tcc/deletar_usuario', async (req, res) => {
    res.json(await deletarUsuario(req.body.cpf));
});

app.patch('/tcc/editar_usuario', async (req, res) => {
    const { codigo, campo, valor } = req.body;
    res.json(await editarCliente(codigo, campo, valor));
});

app.post('/tcc/candidatar', async (req, res) => {
    const { cpf, id_vaga } = req.body;
    if (!cpf || !id_vaga) return res.status(400).json({ sucesso: false, mensagem: "CPF e id_vaga são obrigatórios." });
    res.json(await candidatar(cpf, id_vaga));
});


// ---------- Empresa ----------
app.post('/tcc/add_empresa', async (req, res) => {
    const { nome, cnpj, cidade, estado, email, senha } = req.body;

    if (!nome || !cnpj || !cidade || !estado || !email || !senha) {
        return res.status(400).json({ mensagem: "Dados incompletos." });
    }

    res.json(await inserirEmpresa(nome, cnpj, cidade, estado, email, senha));
});

app.get('/tcc/buscar_Empresas', async (req, res) => {
    res.json(await buscarEmpresa());
});

app.delete('/tcc/deletar_empresa', async (req, res) => {
    res.json(await deletarEmpresa(req.body.id));
});

app.patch('/tcc/editar_empresa', async (req, res) => {
    res.json(await editarEmpresa(req.body.id, req.body.campo, req.body.valor));
});

app.get('/tcc/notificacoes', authEmpresa, async (req, res) => {
    res.json(await listarNotificacoesPorEmpresa(req.empresa.id));
});

app.post('/tcc/notificacao/marcar_lida', authEmpresa, async (req, res) => {
    res.json(await marcarNotificacaoComoLida(req.body.id_notificacao));
});


// ---------- Vagas ----------
app.post('/tcc/add_vaga', async (req, res) => {
    const { nome, id_categoria, preco, id_empresa, is_pcd } = req.body;
    res.json(await inserirVaga(nome, id_categoria, preco, id_empresa, is_pcd ?? false));
});

app.patch('/tcc/editar_vaga', async (req, res) => {
    res.json(await editarVaga(req.body.id_vaga, req.body.campo, req.body.valor));
});

app.get('/tcc/busca_Vaga', async (req, res) => {
    res.json(await buscarVaga());
});

app.post('/tcc/vagas_perfil', async (req, res) => {
    res.json(await buscarVagasPorPerfil(req.body.cpf));
});

app.delete('/tcc/deletar_vaga', async (req, res) => {
    res.json(await deletarVaga(req.body.id_vaga));
});


// ---------- Login ----------
app.post('/tcc/login', async (req, res) => {
    console.log(req.body); // deve mostrar email, senha, tipo
    const resultado = await login(req.body.email, req.body.senha, req.body.tipo);
    res.status(resultado.sucesso ? 200 : 400).json(resultado);
});


// ---------- Rotas protegidas ----------
app.get('/tcc/perfil', autenticarToken, (req, res) => {
    res.json({ sucesso: true, usuario: req.usuario });
});

app.get('/tcc/empresas', autenticarToken, (req, res) => {
    if (req.usuario.tipo !== 'empresa') return res.status(403).json({ mensagem: "Acesso negado." });
    res.json({ sucesso: true, mensagem: "Acesso liberado para empresas." });
});


// -------------------- Inicialização --------------------
const porta = 3000;
app.listen(porta, () => {
    console.log("✅ Servidor rodando na porta " + porta);
    testarConexao();
});
