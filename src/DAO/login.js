const { pool } = require("./conexao");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || "segredo_super_forte";

async function login(email, senha, tipo) {
    if (!email || !senha || !tipo) {
        return { sucesso: false, mensagem: "Email, senha e tipo são obrigatórios." };
    }

    let tabela = tipo === "empresa" ? "tbl_empresa" :
                 tipo === "candidato" ? "tbl_candidato" : null;

    if (!tabela) return { sucesso: false, mensagem: "Tipo de usuário inválido." };

    try {
        const [rows] = await pool.query(`SELECT * FROM ${tabela} WHERE email = ?`, [email]);
        if (rows.length === 0) return { sucesso: false, mensagem: "Usuário não encontrado." };

        const usuario = rows[0];
        const senhaCorreta = await bcrypt.compare(String(senha), usuario.senha);
        if (!senhaCorreta) return { sucesso: false, mensagem: "Senha incorreta." };

        const idUsuario = usuario.id || (tipo === "empresa" ? usuario.id_empresa : usuario.id_candidato);
        const { senha: _, ...usuarioSemSenha } = usuario;

        const token = jwt.sign({ id: idUsuario, nome: usuario.nome || usuario.nome_completo, tipo }, SECRET, { expiresIn: "2h" });

        return { sucesso: true, mensagem: "Login realizado com sucesso.", token, dados: usuarioSemSenha };

    } catch (err) {
        console.error("Erro no login:", err);
        return { sucesso: false, mensagem: "Erro ao realizar login.", erro: err.message };
    }
}

module.exports = { login };
