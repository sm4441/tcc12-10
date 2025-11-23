const { pool } = require('../conexao');

async function listarVagasComDetalhes() {
    const sql = `
        SELECT 
            v.id_vaga,
            v.salario,
            v.is_pcd,
            v.descricao,
            a.nome AS area_de_trabalho,
            e.nome AS nome_empresa,
            e.cidade AS cidade_empresa,
            e.estado AS estado_empresa
        FROM tbl_vaga AS v
        INNER JOIN tbl_areas_de_trabalho AS a
            ON v.id_categoria = a.id
        INNER JOIN tbl_empresa AS e
            ON v.id_empresa = e.id;
    `;

    try {
        const [rows] = await pool.query(sql);
        return rows;
    } catch (err) {
        console.error("Erro ao listar vagas com detalhes:", err);
        return { sucesso: false, erro: err.message };
    }
}

module.exports = { listarVagasComDetalhes };
