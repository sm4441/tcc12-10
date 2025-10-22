const { conexao } = require('../conexao');

async function candidatar(cpf, id_vaga) {
    const conn = await conexao();

    try {
        // Verifica se o candidato existe
        const [candidatoRows] = await conn.query(
            "SELECT cpf, nome_completo FROM tbl_candidato WHERE cpf = ?",
            [cpf]
        );
        if (candidatoRows.length === 0) {
            return { sucesso: false, mensagem: "Candidato não encontrado." };
        }

        const candidato = candidatoRows[0];

        // Cria a candidatura
        const [candidaturaResult] = await conn.query(
            "INSERT INTO tbl_candatura (data_elaboracao, id_candidato) VALUES (NOW(), ?)",
            [cpf]
        );

        const id_candidatura = candidaturaResult.insertId;

        // Relaciona a candidatura com a vaga
        await conn.query(
            "INSERT INTO tbl_contato (id_candidatura, id_vaga) VALUES (?, ?)",
            [id_candidatura, id_vaga]
        );

        // Descobre qual empresa é dona da vaga
        const [vagaRows] = await conn.query(
            "SELECT id_empresa, nome FROM tbl_vaga WHERE id_vaga = ?",
            [id_vaga]
        );

        if (vagaRows.length > 0) {
            const vaga = vagaRows[0];
            const mensagem = `O candidato ${candidato.nome_completo} se inscreveu na vaga ${vaga.nome}.`;

            // Cria notificação para a empresa
            await conn.query(
                "INSERT INTO tbl_notificacao (id_empresa, id_candidatura, mensagem) VALUES (?, ?, ?)",
                [vaga.id_empresa, id_candidatura, mensagem]
            );
        }

        return { sucesso: true, mensagem: "Candidatura realizada e empresa notificada.", id_candidatura };
    } catch (err) {
        return { sucesso: false, mensagem: "Erro ao se candidatar.", erro: err.message };
    } finally {
        if (conn.release) conn.release();
        else await conn.end();
    }
}

module.exports = { candidatar };
    