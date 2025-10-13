const { conexao } = require('../conexao.js');

async function deletarEmpresa(id) {
    const sql = `DELETE FROM tbl_empresa WHERE id = ?`;
    const conn = await conexao();

    try {
        const [results] = await conn.query(sql, [id]);
        await conn.end();

        return {
            sucesso: true,
            mensagem: "Empresa deletada com sucesso.",
            alteracoes: results.affectedRows
        };
    } catch (err) {
        return {
            sucesso: false,
            mensagem: "Erro ao deletar empresa.",
            erro: err.message
        };
    }
}

module.exports = { deletarEmpresa };
