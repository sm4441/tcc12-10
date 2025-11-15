const { conexao } = require('../conexao.js');

async function editarVaga(id_vaga, campo, valor) {
    const data = [valor, id_vaga];

    // Colunas que podem ser atualizadas
    const colunasPermitidas = ['id_categoria', 'valor', 'id_empresa', 'is_pcd'];

    if (!colunasPermitidas.includes(campo)) {
        throw new Error('Coluna inválida');
    }

    const sql = `UPDATE tbl_vaga SET ${campo} = ? WHERE id_vaga = ?;`;
    const conn = await conexao();

    try {
        const [results] = await conn.query(sql, data);
        await conn.end();
        return { sucesso: true, alteracoes: results.affectedRows };
    } catch (err) {
        return { sucesso: false, erro: err.message };
    }
}

module.exports = { editarVaga };
