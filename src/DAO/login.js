const { conexao } = require('../conexao.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Chave secreta (use variável de ambiente em produção)
const SECRET = "segredo_super_forte";

async function login(email, senha, tipo) {
    const conn = await conexao();
    let tabela = "";

    // Define a tabela com base no tipo de usuário
    if (tipo === "empresa") {
        tabela = "tbl_empresa";
    } else if (tipo === "candidato") {
        tabela = "tbl_candidato";
    } else {
        return { sucesso: false, mensagem: "Tipo de usuário inválido." };
    }

    const sql = `SELECT * FROM ${tabela} WHERE email = ?`;

    try {
        const [rows] = await conn.query(sql, [email]);
        await conn.end();

        if (rows.length === 0) {
            return { sucesso: false, mensagem: "Usuário não encontrado." };
        }

        const usuario = rows[0];
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return { sucesso: false, mensagem: "Senha incorreta." };
        }

        // Gera o token JWT
        const token = jwt.sign(
            {
                id: usuario.id || usuario.cpf,
                nome: usuario.nome_completo || usuario.nome,
                tipo
            },
            SECRET,
            { expiresIn: "2h" }
        );

        return {
            sucesso: true,
            mensagem: "Login realizado com sucesso.",
            token,
            usuario: {
                id: usuario.id || usuario.cpf,
                nome: usuario.nome_completo || usuario.nome,
                email: usuario.email
            }
        };
    } catch (err) {
        return { sucesso: false, mensagem: "Erro ao realizar login.", erro: err.message };
    }
}

module.exports = { login };
