const { pool } = require('../conexao');

async function editarCliente(codigo, campo, valor) {
    const colunasPermitidas = [
        'nome_completo',
        'email',
        'telefone',
        'id_endereco',
        'id_status',
        'limite'
    ];

    if (!colunasPermitidas.includes(campo)) {
        throw new Error('Coluna inválida');
    }

    const sql = `UPDATE tbl_cliente SET ${campo} = ? WHERE codigo = ?;`;
    const conn = await pool.getConnection();

    try {
        const [results] = await conn.query(sql, [valor, codigo]);
        return results;
    } catch (err) {
        console.error("Erro ao editar cliente:", err);
        return err.message;
    } finally {
        conn.release();
    }
}

module.exports = { editarCliente };
