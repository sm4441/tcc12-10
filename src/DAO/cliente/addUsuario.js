const { conexao } = require('../conexao.js');

async function inserirCandidato(cpf, nome_completo, telefone, email, id_endereco, id_status, is_pcd = false) {
    const sql = `
        INSERT INTO tbl_candidato 
        (cpf, nome_completo, telefone, email, id_endereco, id_status, is_pcd) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const conn = await conexao();
    try {
        const [resultado] = await conn.query(sql, [
            cpf, nome_completo, telefone, email, id_endereco, id_status, is_pcd
        ]);
        await conn.end();
        return { sucesso: true, idInserido: resultado.insertId };
    } catch (err) {
        return { sucesso: false, erro: err.message };
    }
}

module.exports = { inserirCandidato };
