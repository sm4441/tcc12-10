const { conexao } = require('./conexao');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ⚠️ Use variável de ambiente em produção (nunca deixe a chave no código)
const SECRET = process.env.JWT_SECRET || "segredo_super_forte";

async function login(email, senha, tipo) {
    const conn = await conexao();
    let tabela = "";

    // Escolhe a tabela correta com base no tipo de usuário
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

        // 🔧 Corrigido: comparar a senha com o hash salvo no banco
        const senhaCorreta = await bcrypt.compare(String(senha), usuario.senha);

        if (!senhaCorreta) {
            return { sucesso: false, mensagem: "Senha incorreta." };
        }

        // ✅ Gera o token JWT com validade de 2h
        const token = jwt.sign(
            {
                id: usuario.id || usuario.cpf,
                nome: usuario.nome_completo || usuario.nome,
                tipo,
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
                email: usuario.email,
                tipo,
            },
        };
    } catch (err) {
        return { sucesso: false, mensagem: "Erro ao realizar login.", erro: err.message };
    }
}

module.exports = { login };
