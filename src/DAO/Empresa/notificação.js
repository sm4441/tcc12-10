const { pool } = require('../conexao');

async function listarNotificacoesPorEmpresa(id_empresa) {
    try {
        const [rows] = await pool.query(
            `SELECT id AS id, id_empresa, mensagem, data_envio, lida
             FROM tbl_notificacoes
             WHERE id_empresa = ?
             ORDER BY data_envio DESC`,
            [id_empresa]
        );

        return { sucesso: true, notificacoes: rows };
    } catch (err) {
        console.error("Erro ao listar notificações:", err);
        return { sucesso: false, erro: err.message };
    }
}

async function marcarNotificacaoComoLida(id_notificacao) {
    try {
        const [result] = await pool.query(
            `UPDATE tbl_notificacoes SET lida = TRUE WHERE id = ?`,
            [id_notificacao]
        );

        return { sucesso: true, afetadas: result.affectedRows };
    } catch (err) {
        console.error("Erro ao marcar notificação como lida:", err);
        return { sucesso: false, erro: err.message };
    }
}

module.exports = { listarNotificacoesPorEmpresa, marcarNotificacaoComoLida };
