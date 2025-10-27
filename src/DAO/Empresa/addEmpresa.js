const { conexao } = require('../conexao.js');
const bcrypt = require('bcryptjs');

async function inserirEmpresa(nome, cnpj, cidade, estado, email, senha) {
    const conn = await conexao();

    // 🔒 Criptografa a senha antes de salvar
    const senhaHash = await bcrypt.hash(senha, 10);

    const sql = `
        INSERT INTO tbl_empresa (nome, cnpj, cidade, estado, email, senha)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
        const [resultado] = await conn.query(sql, [
            nome, cnpj, cidade, estado, email, senhaHash
        ]);
        await conn.end(); // remova se usar pool de conexões
        return { sucesso: true, idInserido: resultado.insertId };
    } catch (err) {
        return { sucesso: false, erro: err.message };
    }
}

module.exports = { inserirEmpresa };
