const { pool } = require('../conexao');

async function deletarVaga(id_vaga) {
    const sql = `DELETE FROM tbl_vaga WHERE id_vaga = ?`;

    try {
        const [results] = await pool.query(sql, [id_vaga]);

        return {
            sucesso: true,
            mensagem: "Vaga deletada com sucesso.",
            alteracoes: results.affectedRows
        };
    } catch (err) {
        console.error("Erro ao deletar vaga:", err);
        return {
            sucesso: false,
            mensagem: "Erro ao deletar vaga.",
            erro: err.message
        };
    }
}

module.exports = { deletarVaga };
