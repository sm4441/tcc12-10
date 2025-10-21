const { conexao } = require('../conexao');

async function buscarVagasPorPerfil(cpf) {
    const conn = await conexao();

    try {
        const [candidatoRows] = await conn.query(
            "SELECT id_status, limite, is_pcd FROM tbl_candidato WHERE cpf = ?",
            [cpf]
        );

        if (candidatoRows.length === 0) {
            return { sucesso: false, mensagem: "Candidato não encontrado." };
        }

        const candidato = candidatoRows[0];

        const [vagasRows] = await conn.query(
            `SELECT v.id_vaga, v.nome AS nome_vaga, v.preco, e.nome AS empresa, a.nome AS area
             FROM tbl_vaga v
             JOIN tbl_empresa e ON v.id_empresa = e.id
             JOIN tbl_areas_de_trabalho a ON v.id_categoria = a.id
             WHERE v.id_categoria = ? AND v.preco <= ?`,
             [candidato.id_status, candidato.limite]
        );

        return { sucesso: true, vagas: vagasRows };
    } catch (err) {
        return { sucesso: false, mensagem: "Erro ao buscar vagas.", erro: err.message };
    } finally {
        if (conn.release) conn.release();
        else await conn.end();
    }
}

module.exports = { buscarVagasPorPerfil };
