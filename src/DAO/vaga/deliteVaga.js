const { conexao } = require('../conexao.js');

async function deletarVaga(id_vaga) {
    const sql = `DELETE FROM tbl_vaga WHERE id_vaga = ?`;
    const conn = await conexao();

    try {
        const [results] = await conn.query(sql, [id_vaga]);
        await conn.end();

        return {
            sucesso: true,
            mensagem: "Vaga deletada com sucesso.",
            alteracoes: results.affectedRows
        };
    } catch (err) {
        return {
            sucesso: false,
            mensagem: "Erro ao deletar vaga.",
            erro: err.message
        };
    }
}

module.exports = { deletarVaga };
