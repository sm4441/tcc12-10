const { conexao } = require('../conexao.js');

async function inserirVaga(nome, id_categoria, preco, id_empresa, is_pcd = false) {
    const sql = `
        INSERT INTO tbl_vaga 
        (id_categoria, valor, id_empresa, is_pcd)
        VALUES (?, ?, ?, ?)
    `;

    const conn = await conexao();
    try {
        const [resultado] = await conn.query(sql, [
            nome, id_categoria, preco, id_empresa, is_pcd
        ]);
        await conn.end();
        return { sucesso: true, idInserido: resultado.insertId };
    } catch (err) {
        return { sucesso: false, erro: err.message };
    }
}

module.exports = { inserirVaga };
