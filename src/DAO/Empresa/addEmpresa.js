const { conexao } = require('../conexao.js');

async function inserirEmpresa(nome, cnpj, cidade, estado) {
    const sql = `
              INSERT INTO tbl_empresa (nome, cnpj, cidade, estado) 
              VALUES(?,?,?,?)
    `;

    const conn = await conexao();
    try {
        const [resultado] = await conn.query(sql, [
           nome, cnpj, cidade, estado
        ]);
        await conn.end(); // se não for pool de conexões
        return { sucesso: true, idInserido: resultado.insertId };
    } catch (err) {
        return { sucesso: false, erro: err.message };
    }
}

module.exports = { inserirEmpresa };