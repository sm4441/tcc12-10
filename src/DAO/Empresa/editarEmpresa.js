const { conexao } = require('../conexao.js');

async function editarEmpresa(id, campo, valor) {
    const data = [valor, id];

    // Colunas que podem ser editadas
    const colunasPermitidas = ['nome', 'cnpj', 'telefone', 'email', 'id_endereco'];

    if (!colunasPermitidas.includes(campo)) {
        throw new Error('Coluna inválida');
    }

    const sql = `UPDATE tbl_empresa SET ${campo} = ? WHERE id = ?;`;
    const conn = await conexao();

    try {
        const [results] = await conn.query(sql, data);
        await conn.end();
        return { sucesso: true, alteracoes: results.affectedRows };
    } catch (err) {
        return { sucesso: false, erro: err.message };
    }
}

module.exports = { editarEmpresa };
