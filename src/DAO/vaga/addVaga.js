const { pool } = require('../conexao');

async function inserirVaga(nome, id_categoria, preco, id_empresa, descricao = '', is_pcd = false) {
    try {
        const sql = `
            INSERT INTO tbl_vaga 
            (id_categoria, salario, id_empresa, is_pcd, descricao)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [resultado] = await pool.query(sql, [
            id_categoria,
            preco,
            id_empresa,
            is_pcd,
            descricao
        ]);

        return { sucesso: true, idInserido: resultado.insertId };
    } catch (err) {
        console.error("Erro ao inserir vaga:", err);
        return { sucesso: false, erro: err.message };
    }
}

module.exports = { inserirVaga };
