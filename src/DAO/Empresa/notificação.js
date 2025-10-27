const { conexao } = require('../conexao');

async function listarNotificacoesPorEmpresa(id_empresa) {
  const conn = await conexao();
  try {
      const [rows] = await conn.query(
        `SELECT id AS id, id_empresa, mensagem, data_envio, lida
        FROM tbl_notificacoes
        WHERE id_empresa = ?
        ORDER BY data_envio DESC`,
    [id_empresa]
  );

    return { sucesso: true, notificacoes: rows };
  } catch (err) {
    return { sucesso: false, erro: err.message };
  } finally {
    if (conn.release) conn.release();
    else await conn.end();
  }
}

async function marcarNotificacaoComoLida(id_notificacao) {
  const conn = await conexao();
  try {
    const [result] = await conn.query(
      `UPDATE tbl_notificacoes SET lida = TRUE WHERE id = ?`,
      [id_notificacao]
);

    return { sucesso: true, afetadas: result.affectedRows };
  } catch (err) {
    return { sucesso: false, erro: err.message };
  } finally {
    if (conn.release) conn.release();
    else await conn.end();
  }
}

module.exports = { listarNotificacoesPorEmpresa, marcarNotificacaoComoLida };
