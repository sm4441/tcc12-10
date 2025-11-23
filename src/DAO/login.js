const { pool } = require("./conexao");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || "segredo_super_forte";

async function login(email, senha, tipo) {
    let tabela = "";

    if (tipo === "empresa") {
        tabela = "tbl_empresa";
    } else if (tipo === "candidato") {
        tabela = "tbl_candidato";
    } else {
        return { sucesso: false, mensagem: "Tipo de usuário inválido." };
    }

    const sql = `SELECT * FROM ${tabela} WHERE email = ?`;

    try {
        // ❗ Agora usa pool.query direto, sem criar conexão
        const [rows] = await pool.query(sql, [email]);

        if (rows.length === 0) {
            return { sucesso: false, mensagem: "Usuário não encontrado." };
        }

        const usuario = rows[0];

        // 🔐 Valida senha
        const senhaCorreta = await bcrypt.compare(String(senha), usuario.senha);
        if (!senhaCorreta) {
            return { sucesso: false, mensagem: "Senha incorreta." };
        }

        // 🔑 Identificador correto
        const idUsuario =
            usuario.id ||
            (tipo === "empresa" ? usuario.id_empresa : usuario.id_candidato);

        // 🔐 Gera token JWT
        const token = jwt.sign(
            {
                id: idUsuario,
                nome: usuario.nome || usuario.nome_completo,
                tipo
            },
            SECRET,
            { expiresIn: "2h" }
        );

        return {
            sucesso: true,
            mensagem: "Login realizado com sucesso.",
            token,
            dados: usuario
        };

    } catch (err) {
        console.error("Erro no login:", err);
        return {
            sucesso: false,
            mensagem: "Erro ao realizar login.",
            erro: err.message
        };
    }
}

module.exports = { login };
