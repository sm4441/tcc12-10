const { conexao } = require('../conexao.js');
const bcrypt = require('bcryptjs');

async function inserirCandidato(cpf, nome_completo, telefone, email, id_endereco, id_status, senha, is_pcd = false) {
    const conn = await conexao();

    // 🔒 Criptografa a senha antes de salvar
    const senhaHash = await bcrypt.hash(senha, 10);

    const sql = `
        INSERT INTO tbl_candidato 
        (cpf, nome_completo, telefone, email, id_endereco, id_status, senha, is_pcd) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        const [resultado] = await conn.query(sql, [
            cpf, nome_completo, telefone, email, id_endereco, id_status, senhaHash, is_pcd
        ]);
        await conn.end();
        return { sucesso: true, idInserido: resultado.insertId };
    } catch (err) {
        return { sucesso: false, erro: err.message };
    }
}


module.exports = { inserirCandidato };
