const { conexao } = require('../conexao');

async function candidatar(cpf, id_vaga) {
    const conn = await conexao();

    try {
        // 1️⃣ Registrar a candidatura
        const sqlCandidatura = `
            INSERT INTO tbl_candatura (data_elaboracao, id_candidato)
            VALUES (CURDATE(), ?)
        `;
        const [result] = await conn.query(sqlCandidatura, [cpf]);

        // 2️⃣ Relacionar com a vaga
        const sqlContato = `
            INSERT INTO tbl_contato (id_candidatura, id_vaga)
            VALUES (?, ?)
        `;
        await conn.query(sqlContato, [result.insertId, id_vaga]);

        // 3️⃣ Buscar empresa responsável pela vaga
        const [vaga] = await conn.query(
            `SELECT id_empresa, nome FROM tbl_vaga WHERE id_vaga = ?`,
            [id_vaga]
        );

        if (vaga.length > 0) {
            const id_empresa = vaga[0].id_empresa;

            // 4️⃣ Criar notificação
            const mensagem = `Novo candidato se inscreveu para a vaga: ${vaga[0].nome}`;
            await conn.query(
                `INSERT INTO tbl_notificacoes (id_empresa, mensagem) VALUES (?, ?)`,
                [id_empresa, mensagem]
            );
        }

        return { sucesso: true, mensagem: "Candidatura registrada e empresa notificada com sucesso!" };
    } catch (err) {
        return { sucesso: false, mensagem: "Erro ao candidatar.", erro: err.message };
    } finally {
        if (conn.release) conn.release();
        else await conn.end();
    }
}

module.exports = { candidatar };
