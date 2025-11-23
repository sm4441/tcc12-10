const { pool } = require('../conexao');
const bcrypt = require('bcryptjs');

async function inserirEmpresa(nome, cnpj, cidade, estado, email, senha) {
    try {
        // 🔒 Criptografa a senha antes de salvar
        const senhaHash = await bcrypt.hash(senha, 10);

        const sql = `
            INSERT INTO tbl_empresa (nome, cnpj, cidade, estado, email, senha)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        // Usando pool diretamente
        const [resultado] = await pool.query(sql, [
            nome, cnpj, cidade, estado, email, senhaHash
        ]);

        return { sucesso: true, idInserido: resultado.insertId };
    } catch (err) {
        console.error("Erro ao inserir empresa:", err); // Mostra o erro no console
        return { sucesso: false, erro: err.message };
    }
}

module.exports = { inserirEmpresa };
