const { conexao } = require('../conexao.js');

async function listarVagasComDetalhes() {
  const sql = `
    SELECT 
        v.id_vaga,
        v.salario,
        v.is_pcd,
        v.descricao,
        a.nome AS area_de_trabalho,
        e.nome_fantasia AS nome_empresa
    FROM tbl_vaga AS v
    INNER JOIN tbl_areas_de_trabalho AS a
        ON v.id_categoria = a.id
    INNER JOIN tbl_empresa AS e
        ON v.id_empresa = e.id;
  `;

  const conn = await conexao();
  const [rows] = await conn.query(sql);
  return rows;
}
