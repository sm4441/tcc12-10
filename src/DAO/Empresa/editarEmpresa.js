const { pool } = require('../conexao');

async function editarEmpresa(id, campo, valor) {
    const colunasPermitidas = ['nome', 'cnpj', 'telefone', 'email']; // ajuste conforme sua tabela
    if (!colunasPermitidas.includes(campo)) {
        throw new Error('Coluna inválida');
    }

    const sql = `UPDATE tbl_empresa SET ${campo} = ? WHERE id = ?;`;

    try {
        const [results] = await pool.query(sql, [valor, id]);
        return { sucesso: true, alteracoes: results.affectedRows };
    } catch (err) {
        console.error("Erro ao editar empresa:", err);
        return { sucesso: false, erro: err.message };
    }
}

module.exports = { editarEmpresa };
