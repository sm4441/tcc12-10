const { conexao } = require('../conexao.js')

/**
 * Deleta uma empresa da tabela 'tbl_empresa' pelo ID.
 * @param {number} id O ID da empresa a ser deletada.
 * @returns {Promise<object>} Os resultados da query ou um objeto de erro.
 */
async function deletarEmpresa(id) {
    // Inicializa a variável 'conn' fora do bloco try
    // para que ela possa ser acessada no bloco 'finally'.
    let conn; 

    try {
        const pool = await conexao(); // Pega o pool
        conn = await pool.getConnection(); // Pega uma conexão individual

        let sql = 'DELETE FROM tbl_empresa WHERE id = ?';
        const [results] = await conn.query(sql, [id]);

        // Não é necessário liberar a conexão aqui, pois o bloco 'finally' fará isso.
        return results; 

    } catch (err) {
        // Loga o erro, mas não libera a conexão.
        // O bloco 'finally' cuida da liberação.
        console.error("Erro ao deletar empresa:", err.message);
        return { erro: err.message };

    } finally {
        // **CORREÇÃO CRÍTICA**: Garante que a conexão seja liberada
        // SOMENTE se ela foi adquirida com sucesso ('conn' não é undefined).
        if (conn) {
            conn.release(); // Devolve a conexão ao pool
        }
    }
}

module.exports = { deletarEmpresa };