const express = require('express');
const app = express(); // <--- Esta linha estava faltando
//candidato
const cors = require('cors');
const { conexao } = require('./src/DAO/conexao');
const editarPerfil = require('./src/DAO/perfil.js').editarPerfil;

// -------------------- Middleware --------------------
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// -------------------- Imports --------------------
// Candidato
>>>>>>> 0cf43a5b0fb7ab43b85ca79f872e4734609c72c0
const { buscarClientes } = require('./src/DAO/cliente/buscarClientes.js');
const { inserirCandidato } = require('./src/DAO/cliente/addUsuario.js');
const {deletarUsuario} = require('./src/DAO/cliente/deliteCliente');
const { editarCliente } = require('./src/DAO/cliente/editarCliente.js');
const {candidatar} = require('./src/DAO/cliente/caditarse.js')
//empresa
const { inserirEmpresa } = require('./src/DAO/Empresa/addEmpresa.js');
const {buscarEmpresa} = require('./src/DAO/Empresa/buscarEmpresa.js');
const {deletarEmpresa} = require('./src/DAO/Empresa/deletEmpresa.js');
const {editarEmpresa} = require('./src/DAO/Empresa/editarEmpresa');
const {marcarNotificacaoComoLida}= require('./src/DAO/Empresa/notificação.js');
const {listarNotificacoesPorEmpresa}= require('./src/DAO/Empresa/notificação.js')
const { authEmpresa } = require('./src/DAO/middleware/authEmpresa.js');
<<<<<<< HEAD
//Vaga
const {inserirVaga} = require('./src/DAO/vaga/addVaga.js');
const {editarVaga} = require('./src/DAO/vaga/aditarVaga.js');
const {buscarVaga} = require('./src/DAO/vaga/buscarVaga.js');
const {deletarVaga} = require('./src/DAO/vaga/deliteVaga');
const {buscarVagasPorPerfil} = require('./src/DAO/vaga/vagas_perfil')
//login
=======

// Vaga
const { inserirVaga } = require('./src/DAO/vaga/addVaga.js');
const { editarVaga } = require('./src/DAO/vaga/aditarVaga.js');
const { listarVagasComDetalhes } = require('./src/DAO/vaga/buscarVaga.js');
const { deletarVaga } = require('./src/DAO/vaga/deliteVaga.js');
const { buscarVagasPorPerfil } = require('./src/DAO/vaga/vagas_perfil.js');

// Login
>>>>>>> 0cf43a5b0fb7ab43b85ca79f872e4734609c72c0
const { login } = require('./src/DAO/login.js');
const bodyParser = require('body-parser');
//midwer
const {autenticarToken} = require('./src/DAO/middleware/authMiddleware.js')
const { conexao, closeConexao, testarConexao } = require('./src/DAO/conexao');

// Middleware necessário para usar req.body com JSON
app.use(express.json());

app.get('/tcc/v1', (req, res) => {
    res.json({ msg: "Aplicação Funcionando tcc" });
});

app.get('/tcc/busca', async (req, res) => {
    let candidato = await buscarClientes();
    res.json(candidato);
});
//add cliente

app.post('/tcc/add_usuario', async (req, res) => {
    try {
        const { cpf, telefone, nome_completo, email, id_endereco, id_status, senha, limite, is_pcd } = req.body;

        // Validação: verificar se todos os campos obrigatórios estão presentes
        if (!cpf || !nome_completo || !telefone || !email || !limite || id_endereco == null || id_status == null || !senha) {
            return res.status(400).json({
                mensagem: "Dados incompletos: todos os campos obrigatórios devem ser informados."
            });
        }

        // Inserir no banco
        const resultado = await inserirCandidato(
            cpf,
            nome_completo,
            telefone,
            email,
            id_endereco,
            id_status,
            senha,
            limite,
            is_pcd ?? false // padrão: pessoa normal
        );

        if (resultado.sucesso) {
            return res.status(201).json({
                mensagem: "Candidato inserido com sucesso.",
                id: resultado.idInserido
            });
        } else {
            return res.status(500).json({
                mensagem: "Erro ao inserir candidato.",
                erro: resultado.erro
            });
        }
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro inesperado.",
            erro: error.message
        });
    }
});




//delitpopopopopopop

app.delete('/tcc/deletar_usuario', async (req, res) =>{
    let { cpf } = req.body
    let result = await deletarUsuario(cpf)
    res.json(result)
});



//editar

app.patch('/empresa_produtos_limpeza/v4/cliente', async (req, res) =>{
    let {codigo, campo, valor } = req.body
    let resultado = await editarCliente(codigo, campo, valor)
    res.status(200).json(resultado)
    
})

//candidatar se 

app.post('/tcc/candidatar', async (req, res) => {
    const { cpf, id_vaga } = req.body;

    if (!cpf || !id_vaga) {
        return res.status(400).json({ sucesso: false, mensagem: "CPF e id_vaga são obrigatórios." });
    }

    const resultado = await candidatar(cpf, id_vaga);
    res.json(resultado);
});


//Epresa1234567890

// addEmpresa

app.post('/tcc/add_empresa', async (req, res) => {
    try {
        const { nome, cnpj, cidade, estado, email, senha } = req.body;

        // Validação: todos os campos obrigatórios
        if (!nome || !cnpj || !cidade || !estado || !email || !senha) {
            return res.status(400).json({
                mensagem: "Dados incompletos: todos os campos são obrigatórios."
            });
        }

        // Inserir no banco
        const resultado = await inserirEmpresa(nome, cnpj, cidade, estado, email, senha);

        if (resultado.sucesso) {
            return res.status(201).json({
                mensagem: "Empresa inserida com sucesso",
                id: resultado.idInserido
            });
        } else {
            return res.status(500).json({
                mensagem: "Erro ao inserir empresa",
                erro: resultado.erro
            });
        }

    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro inesperado",
            erro: error.message
        });
    }
});


//buscar Empresa

app.get('/tcc/buscar_Empresas', async (req, res) => {
    let Empresa = await buscarEmpresa();
    res.json(Empresa);
});

//deletar empresa

app.delete('/tcc/deletar_empresa', async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({
                mensagem: "O campo 'id' é obrigatório."
            });
        }

        const resultado = await deletarEmpresa(id);

        if (resultado.sucesso && resultado.alteracoes > 0) {
            return res.status(200).json({
                mensagem: "Empresa deletada com sucesso."
            });
        } else if (resultado.sucesso && resultado.alteracoes === 0) {
            return res.status(404).json({
                mensagem: "Nenhuma empresa encontrada com o ID informado."
            });
        } else {
            return res.status(500).json({
                mensagem: resultado.mensagem,
                erro: resultado.erro
            });
        }
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro inesperado.",
            erro: error.message
        });
    }
});


//editar

app.patch('/tcc/editar_empresa', async (req, res) => {
    try {
        const { id, campo, valor } = req.body;

        if (!id || !campo) {
            return res.status(400).json({
                mensagem: "Campos obrigatórios ausentes: id e campo."
            });
        }

        const resultado = await editarEmpresa(id, campo, valor);

        if (resultado.sucesso) {
            return res.status(200).json({
                mensagem: "Empresa atualizada com sucesso.",
                alteracoes: resultado.alteracoes
            });
        } else {
            return res.status(400).json({
                mensagem: "Erro ao atualizar empresa.",
                erro: resultado.erro
            });
        }
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro inesperado.",
            erro: error.message
        });
    }
});




// Listar notificações da empresa logada (usa token)
app.get('/tcc/notificacoes', authEmpresa, async (req, res) => {
  const id_empresa = req.empresa.id;
  const resultado = await listarNotificacoesPorEmpresa(id_empresa);
  if (!resultado.sucesso) return res.status(500).json(resultado);
  res.json(resultado);
});

// Marcar notificação como lida (empresa logada)
app.post('/tcc/notificacao/marcar_lida', authEmpresa, async (req, res) => {
  const { id_notificacao } = req.body;
  if (!id_notificacao) return res.status(400).json({ sucesso: false, mensagem: 'id_notificacao é obrigatório.' });

  const resultado = await marcarNotificacaoComoLida(id_notificacao);
  if (!resultado.sucesso) return res.status(500).json(resultado);
  res.json({ sucesso: true, mensagem: resultado.afetadas > 0 ? 'Notificação marcada como lida.' : 'Notificação não encontrada.' });
});



//vaga tyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyytttttttttttttyyyyyyyyyyyyyyyy

//add

app.post('/tcc/add_vaga', async (req, res) => {
<<<<<<< HEAD
    try {
        const { nome, id_categoria, preco, id_empresa, is_pcd } = req.body;

        // Validação dos campos obrigatórios
        if (!nome || id_categoria == null || preco == null || id_empresa == null) {
            return res.status(400).json({
                mensagem: "Dados incompletos: todos os campos obrigatórios devem ser informados."
            });
        }

        // Inserir no banco
        const resultado = await inserirVaga(
            nome,
            id_categoria,
            preco,
            id_empresa,
            is_pcd ?? false // padrão: vaga normal
        );

        if (resultado.sucesso) {
            return res.status(201).json({
                mensagem: "Vaga inserida com sucesso.",
                id: resultado.idInserido
            });
        } else {
            return res.status(500).json({
                mensagem: "Erro ao inserir vaga.",
                erro: resultado.erro
            });
        }
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro inesperado.",
            erro: error.message
        });
    }
=======
    const { id_categoria, salario, id_empresa, is_pcd, descricao } = req.body;
    res.json(await inserirVaga(id_categoria, salario, id_empresa, is_pcd ?? false, descricao));

>>>>>>> 0cf43a5b0fb7ab43b85ca79f872e4734609c72c0
});


//aditar

app.patch('/tcc/editar_vaga', async (req, res) => {
    try {
        const { id_vaga, campo, valor } = req.body;

        if (!id_vaga || !campo) {
            return res.status(400).json({
                mensagem: "Campos obrigatórios ausentes: id_vaga e campo."
            });
        }

        const resultado = await editarVaga(id_vaga, campo, valor);

        if (resultado.sucesso) {
            return res.status(200).json({
                mensagem: "Vaga atualizada com sucesso.",
                alteracoes: resultado.alteracoes
            });
        } else {
            return res.status(400).json({
                mensagem: "Erro ao atualizar vaga.",
                erro: resultado.erro
            });
        }
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro inesperado.",
            erro: error.message
        });
    }
});

//buscar vaga

app.get('/tcc/busca_Vaga', async (req, res) => {
<<<<<<< HEAD
    let candidato = await buscarVaga();
    res.json(candidato);
=======
    res.json(await listarVagasComDetalhes());
>>>>>>> 0cf43a5b0fb7ab43b85ca79f872e4734609c72c0
});
//vagas por perfil
app.post('/tcc/vagas_perfil', async (req, res) => {
    const { cpf } = req.body;

    if (!cpf) {
        return res.status(400).json({ sucesso: false, mensagem: "CPF não informado." });
    }

    const resultado = await buscarVagasPorPerfil(cpf);
    res.json(resultado);
});
//delete

app.delete('/tcc/deletar_vaga', async (req, res) => {
    try {
        const { id_vaga } = req.body;

        if (!id_vaga) {
            return res.status(400).json({
                mensagem: "O campo 'id_vaga' é obrigatório."
            });
        }

        const resultado = await deletarVaga(id_vaga);

        if (resultado.sucesso && resultado.alteracoes > 0) {
            return res.status(200).json({
                mensagem: "Vaga deletada com sucesso."
            });
        } else if (resultado.sucesso && resultado.alteracoes === 0) {
            return res.status(404).json({
                mensagem: "Nenhuma vaga encontrada com o ID informado."
            });
        } else {
            return res.status(500).json({
                mensagem: resultado.mensagem,
                erro: resultado.erro
            });
        }
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro inesperado.",
            erro: error.message
        });
    }
});

//login

app.post("/tcc/login", async (req, res) => {
    const { email, senha, tipo } = req.body;
    const resultado = await login(email, senha, tipo);
    res.status(resultado.sucesso ? 200 : 400).json(resultado);
});


<<<<<<< HEAD
//midwer


// 🟢 Rota protegida → só acessa quem estiver logado
app.get("/tcc/perfil", autenticarToken, (req, res) => {
    res.json({
        sucesso: true,
        mensagem: "Acesso autorizado!",
        usuario: req.usuario
    });
});

// Exemplo: rota de empresas protegida
app.get("/tcc/empresas", autenticarToken, async (req, res) => {
    // Aqui você pode usar req.usuario.tipo para restringir ainda mais:
    if (req.usuario.tipo !== "empresa") {
        return res.status(403).json({ sucesso: false, mensagem: "Acesso permitido apenas para empresas." });
    }

    // Exemplo fictício de resposta:
    res.json({
        sucesso: true,
        mensagem: "Lista de empresas acessada com sucesso!",
        usuario: req.usuario
    });
=======
// ---------- Rotas protegidas ----------
app.get('/tcc/perfil', autenticarToken, async (req, res) => {
    const conn = await conexao();
    const usuarioId = req.usuario.id; // vem do token
    const tipo = req.usuario.tipo;

    let tabela = tipo === "empresa" ? "tbl_empresa" : "tbl_candidato";
    let campoId = tipo === "empresa" ? "cnpj" : "cpf";

    try {
        const [rows] = await conn.query(`SELECT * FROM ${tabela} WHERE ${campoId} = ?`, [usuarioId]);
        await conn.end();

        if (rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: "Usuário não encontrado." });
        }

        res.json({ sucesso: true, usuario: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ sucesso: false, mensagem: "Erro interno ao buscar perfil.", erro: err.message });
    }
});
app.put('/tcc/perfil', autenticarToken, async (req, res) => {
    const tipo = req.usuario.tipo;       // 'empresa' ou 'candidato'
    const idUsuario = req.usuario.id;    // CPF ou CNPJ vindo do token
    const dadosAtualizados = req.body;   // Objeto com os campos a atualizar

    try {
        const resultado = await editarPerfil(idUsuario, tipo, dadosAtualizados);
        if (resultado.sucesso) {
            res.json(resultado);
        } else {
            res.status(400).json(resultado);
        }
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: "Erro interno ao atualizar perfil.", erro: erro.message });
    }
});
app.put('/tcc/editar-perfil', autenticarToken, async (req, res) => {
    const conn = await conexao();
    const usuarioId = req.usuario.id;
    const tipo = req.usuario.tipo;

    // Determina tabela e coluna de id
    const tabela = tipo === "empresa" ? "tbl_empresa" : "tbl_candidato";
    const campoId = tipo === "empresa" ? "cnpj" : "cpf";

    // Lista de colunas válidas para cada tabela
    const colunasValidas = tipo === "empresa"
        ? ["nome", "telefone", "email", "senha", "cidade", "estado"]
        : ["nome_completo", "telefone", "email", "senha"]; // Removemos data_nascimento se não existir

    try {
        const campos = [];
        const valores = [];

        // Monta campos e valores apenas se existirem na tabela
        for (const campo of colunasValidas) {
            if (req.body[campo] !== undefined) {
                campos.push(`${campo} = ?`);
                valores.push(req.body[campo]);
            }
        }

        if (campos.length === 0) {
            await conn.end();
            return res.status(400).json({ sucesso: false, mensagem: "Nenhum dado válido para atualizar." });
        }

        valores.push(usuarioId);

        // Executa UPDATE
        await conn.query(`UPDATE ${tabela} SET ${campos.join(", ")} WHERE ${campoId} = ?`, valores);
        await conn.end();

        res.json({ sucesso: true, mensagem: "Perfil atualizado com sucesso!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ sucesso: false, mensagem: "Erro ao atualizar perfil.", erro: err.message });
    }
>>>>>>> 0cf43a5b0fb7ab43b85ca79f872e4734609c72c0
});
const porta = 3000;

app.listen(porta, () => {
    console.log("Operando na porta " + porta);
    testarConexao();
});


