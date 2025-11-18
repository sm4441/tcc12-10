const { conexao } = require('./conexao');
const bcrypt = require('bcryptjs');

async function editarPerfil(cpfOuCnpj, tipo, dadosAtualizados) {
    const conn = await conexao();

    try {
        let tabela, campoId;

        // --- Define tabela e primary key de acordo com o tipo ---
        if (tipo === "empresa") {
            tabela = "tbl_empresa";
            campoId = "cnpj";
        } else if (tipo === "candidato") {
            tabela = "tbl_candidato";
            campoId = "cpf";
        } else {
            return { sucesso: false, mensagem: "Tipo de usuário inválido." };
        }

        // --- Consulta as colunas reais da tabela ---
        const [colunasTabela] = await conn.query(`SHOW COLUMNS FROM ${tabela}`);
        const nomesColunas = colunasTabela.map(c => c.Field);

        const updates = [];
        const values = [];

        // 🔧 Atualiza apenas se a coluna existir na tabela correspondente
        const tentarAdicionar = async (coluna, valor, hashSenha = false) => {
            if (nomesColunas.includes(coluna) && valor) {
                if (hashSenha) {
                    const hash = await bcrypt.hash(valor, 10);
                    updates.push(`${coluna} = ?`);
                    values.push(hash);
                } else {
                    updates.push(`${coluna} = ?`);
                    values.push(valor);
                }
            }
        };

        // --- Verifica campos válidos ---
        await tentarAdicionar("nome_completo", dadosAtualizados.nome_completo);
        await tentarAdicionar("nome_fantasia", dadosAtualizados.nome_fantasia);
        await tentarAdicionar("razao_social", dadosAtualizados.razao_social);
        await tentarAdicionar("telefone", dadosAtualizados.telefone);
        await tentarAdicionar("email", dadosAtualizados.email);
        await tentarAdicionar("senha", dadosAtualizados.senha, true);
        await tentarAdicionar("data_nascimento", dadosAtualizados.data_nascimento);

        if (updates.length === 0) {
            return { sucesso: false, mensagem: "Nenhum campo válido para atualizar." };
        }

        // --- WHERE ---
        values.push(cpfOuCnpj);

        const sql = `UPDATE ${tabela} SET ${updates.join(", ")} WHERE ${campoId} = ?`;
        await conn.query(sql, values);

        return { sucesso: true, mensagem: "Perfil atualizado com sucesso." };

    } catch (err) {
        return { sucesso: false, mensagem: "Erro ao atualizar perfil.", erro: err.message };
    } finally {
        if (conn.release) conn.release();
        else await conn.end();
    }
}

module.exports = { editarPerfil };
