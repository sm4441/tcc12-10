const { conexao } = require('./conexao');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || "segredo_super_forte";

async function login(email, senha, tipo) {
    const conn = await conexao();
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
        const [rows] = await conn.query(sql, [email]);
        await conn.end();

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
        const idUsuario = usuario.id || (tipo === "empresa" ? usuario.cnpj : usuario.cpf);

        // 🔐 Gera token JWT
        const token = jwt.sign(
            {
                id: idUsuario,
                nome: usuario.nome,
                tipo
            },
            SECRET,
            { expiresIn: "2h" }
        );

        return {
            sucesso: true,
            mensagem: "Login realizado com sucesso.",
            token,

            // 🔥 Retorna TODOS os dados da tabela
            dados: usuario
        };

    } catch (err) {
        return { sucesso: false, mensagem: "Erro ao realizar login.", erro: err.message };
    }
}

module.exports = { login };
