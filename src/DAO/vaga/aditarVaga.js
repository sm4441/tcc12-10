const { pool } = require('../conexao');

async function editarVaga(id_vaga, campo, valor) {
    const colunasPermitidas = ['id_categoria', 'salario', 'id_empresa', 'is_pcd']; // ajuste conforme tabela
    if (!colunasPermitidas.includes(campo)) {
        throw new Error('Coluna inválida');
    }

    const sql = `UPDATE tbl_vaga SET ${campo} = ? WHERE id_vaga = ?;`;

    try {
        const [results] = await pool.query(sql, [valor, id_vaga]);
        return { sucesso: true, alteracoes: results.affectedRows };
    } catch (err) {
        console.error("Erro ao editar vaga:", err);
        return { sucesso: false, erro: err.message };
    }
}

module.exports = { editarVaga };
