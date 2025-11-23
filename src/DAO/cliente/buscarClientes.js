const { pool } = require('../conexao');

async function buscarClientes() {
  try {
    const sql = `
      SELECT 
        c.cpf,
        c.nome_completo,
        c.telefone,
        c.email,
        e.logradouro,
        e.numero,
        e.bairro,
        e.cidade,
        e.cep
      FROM tbl_candidato AS c
      INNER JOIN tbl_endereco_do_candidato AS e
        ON c.id_endereco = e.id;
    `;

    // Executar a consulta usando pool
    const [rows] = await pool.query(sql);

    return rows;

  } catch (err) {
    return { erro: err.message };
  }
}

module.exports = { buscarClientes };
