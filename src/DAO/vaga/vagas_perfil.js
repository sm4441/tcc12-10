const { pool } = require('../conexao');

async function buscarVagasPorPerfil(cpf) {
    try {
        // Busca o candidato e sua área de atuação (id_status)
        const [candidatoRows] = await pool.query(
            "SELECT id_status, is_pcd FROM tbl_candidato WHERE cpf = ?",
            [cpf]
        );

        if (candidatoRows.length === 0) {
            return { sucesso: false, mensagem: "Candidato não encontrado." };
        }

        const candidato = candidatoRows[0];

        // Busca vagas com base na área (id_status)
        const [vagasRows] = await pool.query(
            `SELECT v.id_vaga AS nome_vaga, e.nome AS empresa, a.nome AS area, v.is_pcd
             FROM tbl_vaga v
             JOIN tbl_empresa e ON v.id_empresa = e.id
             JOIN tbl_areas_de_trabalho a ON v.id_categoria = a.id
             WHERE v.id_categoria = ? 
             AND (v.is_pcd = FALSE OR (v.is_pcd = TRUE AND ? = TRUE))`,
            [candidato.id_status, candidato.is_pcd]
        );

        return { sucesso: true, vagas: vagasRows };
    } catch (err) {
        console.error("Erro ao buscar vagas por perfil:", err);
        return { sucesso: false, mensagem: "Erro ao buscar vagas.", erro: err.message };
    }
}

module.exports = { buscarVagasPorPerfil };
