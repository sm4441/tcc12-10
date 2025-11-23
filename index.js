const express = require('express');
const cors = require('cors');
const { pool } = require('./src/DAO/conexao.js'); 

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

// Vagas
const { inserirVaga } = require('./src/DAO/vaga/addVaga.js');
const { editarVaga } = require('./src/DAO/vaga/aditarVaga.js');
const { listarVagasComDetalhes } = require('./src/DAO/vaga/buscarVaga.js');
const { deletarVaga } = require('./src/DAO/vaga/deliteVaga.js');
const { buscarVagasPorPerfil } = require('./src/DAO/vaga/vagas_perfil.js');

// Login
const { login } = require('./src/DAO/login.js');
const { autenticarToken } = require('./src/DAO/middleware/authMiddleware.js');

// Rota Externa
const routerempresa = require('./src/DAO/tokenempresa.js');
app.use('/tcc', routerempresa);


// -------------------- Rotas --------------------
app.get('/tcc/v1', (req, res) => {
    res.json({ msg: "Aplicação Funcionando tcc" });
});


// ---------- Candidato ----------
app.get('/tcc/busca', async (req, res) => {
    res.json(await buscarClientes());
});

app.post('/tcc/add_usuario', async (req, res) => {
    const { 
        cpf, telefone, nome_completo, email, senha, limite, is_pcd,
        id_status, endereco 
    } = req.body;

    if (!cpf || !nome_completo || !telefone || !email || !senha || !limite || id_status == null) {
        return res.status(400).json({ mensagem: "Dados incompletos." });
    }

    if (
        !endereco ||
        !endereco.logradouro ||
        !endereco.cep ||
        endereco.numero == null ||
        !endereco.bairro ||
        !endereco.cidade
    ) {
        return res.status(400).json({ mensagem: "Endereço incompleto." });
    }

    const resultado = await inserirCandidato(
        cpf,
        nome_completo,
        telefone,
        email,
        endereco,
        id_status,
        senha,
        limite,
        is_pcd ?? false
    );

    return res.status(resultado.sucesso ? 201 : 500).json(resultado);
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
    if (!cpf || !id_vaga) {
        return res.status(400).json({ sucesso: false, mensagem: "CPF e id_vaga são obrigatórios." });
    }
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
app.post('/tcc/add_vaga', autenticarToken, async (req, res) => {
    try {
        const { nome, preco, is_pcd } = req.body;
        const id_empresa_token = req.usuario.id;
        const id_categoria = req.body.id_categoria || 1;

        if (!nome || preco == null || !id_empresa_token) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Dados incompletos: nome, preço e ID da empresa são obrigatórios."
            });
        }

        const resultado = await inserirVaga(
            nome,
            id_categoria,
            preco,
            id_empresa_token,
            is_pcd ?? false
        );

        if (!resultado.sucesso) {
            return res.status(500).json({
                sucesso: false,
                mensagem: resultado.mensagem || "Erro ao inserir vaga.",
                erro: resultado.erro
            });
        }

        return res.status(201).json({
            sucesso: true,
            mensagem: "Vaga inserida com sucesso.",
            id: resultado.idInserido
        });

    } catch (error) {
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro inesperado no servidor.",
            erro: error.message
        });
    }
});

app.patch('/tcc/editar_vaga', async (req, res) => {
    res.json(await editarVaga(req.body.id_vaga, req.body.campo, req.body.valor));
});

app.get('/tcc/busca_Vaga', async (req, res) => {
    res.json(await listarVagasComDetalhes());
});

app.post('/tcc/vagas_perfil', async (req, res) => {
    res.json(await buscarVagasPorPerfil(req.body.cpf));
});

app.delete('/tcc/deletar_vaga', async (req, res) => {
    res.json(await deletarVaga(req.body.id_vaga));
});


// ---------- Login ----------
app.post('/tcc/login', async (req, res) => {
    const resultado = await login(req.body.email, req.body.senha, req.body.tipo);
    res.status(resultado.sucesso ? 200 : 400).json(resultado);
});


// ---------- Perfil (Corrigido: usando POOL) ----------
app.get('/tcc/perfil', autenticarToken, async (req, res) => {
    try {
        const usuario = req.usuario;

        if (usuario.tipo === 'candidato') {
            const [rows] = await pool.query(`
                SELECT c.cpf AS id, c.nome_completo, c.email, c.telefone, c.is_pcd, c.limite, 
                       a.nome AS area, e.logradouro, e.numero, e.bairro, e.cidade, e.cep
                FROM tbl_candidato c
                LEFT JOIN tbl_areas_de_trabalho a ON c.id_status = a.id
                LEFT JOIN tbl_endereco_do_candidato e ON c.id_endereco = e.id
                WHERE c.cpf = ?
            `, [usuario.id]);

            return res.json({ sucesso: true, usuario: rows[0] });
        }

        if (usuario.tipo === 'empresa') {
            const [rows] = await pool.query(`
                SELECT id, nome, cnpj, email, cidade, estado
                FROM tbl_empresa
                WHERE id = ?
            `, [usuario.id]);

            return res.json({ sucesso: true, usuario: rows[0] });
        }

        return res.status(400).json({ sucesso: false, mensagem: 'Tipo de usuário inválido.' });

    } catch (err) {
        return res.json({ sucesso: false, mensagem: err.message });
    }
});


// ---------- Rotas privadas (teste) ----------
app.get('/tcc/empresas', autenticarToken, (req, res) => {
    if (req.usuario.tipo !== 'empresa') {
        return res.status(403).json({ mensagem: "Acesso negado." });
    }
    res.json({ sucesso: true, mensagem: "Acesso liberado para empresas." });
});


// -------------------- Inicialização --------------------
const porta = 3000;
app.listen(porta, () => {
    console.log("✅ Servidor rodando na porta " + porta);
});
