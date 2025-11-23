const { pool } = require('../conexao');

async function deletarEmpresa(id) {
    try {
        const sql = `DELETE FROM tbl_empresa WHERE id = ?`;
        const [results] = await pool.query(sql, [id]);

        return {
            sucesso: true,
            mensagem: "Empresa deletada com sucesso.",
            alteracoes: results.affectedRows
        };
    } catch (err) {
        console.error("Erro ao deletar empresa:", err); // Mostra no console
        return {
            sucesso: false,
            mensagem: "Erro ao deletar empresa.",
            erro: err.message
        };
    }
}

module.exports = { deletarEmpresa };
