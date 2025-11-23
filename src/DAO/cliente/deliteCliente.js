const { pool } = require('../conexao');

async function deletarUsuario(cpf){
    const sql = `DELETE FROM tbl_candidato WHERE cpf = ?`;

    const conn = await pool.getConnection(); // ✔ CORRETO

    try {
        const [results] = await conn.query(sql, [cpf]);
        return results;
    } catch (err) {
        console.error("Erro ao deletar usuário:", err); // ✔ Mostra no console
        return err.message;
    } finally {
        conn.release(); // ✔ Libera a conexão!
    }
}

module.exports = { deletarUsuario };
