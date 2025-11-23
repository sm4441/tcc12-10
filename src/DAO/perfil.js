const { pool } = require('./conexao');
const bcrypt = require('bcryptjs');

async function editarPerfil(cpfOuCnpj, tipo, dadosAtualizados) {
    try {
        let tabela, campoId;

        // --- Define tabela e primary key ---
        if (tipo === "empresa") {
            tabela = "tbl_empresa";
            campoId = "cnpj";
        } else if (tipo === "candidato") {
            tabela = "tbl_candidato";
            campoId = "cpf";
        } else {
            return { sucesso: false, mensagem: "Tipo de usuário inválido." };
        }

        // --- Consulta colunas reais da tabela ---
        const [colunasTabela] = await pool.query(`SHOW COLUMNS FROM ${tabela}`);
        const nomesColunas = colunasTabela.map(c => c.Field);

        const updates = [];
        const values = [];

        // --- Função para adicionar campo somente se existir ---
        const tentarAdicionar = async (coluna, valor, hashSenha = false) => {
            if (!nomesColunas.includes(coluna)) return;   // ignora colunas inexistentes
            if (valor === undefined || valor === null || valor === "") return;

            if (hashSenha) {
                const hash = await bcrypt.hash(String(valor), 10);
                updates.push(`${coluna} = ?`);
                values.push(hash);
            } else {
                updates.push(`${coluna} = ?`);
                values.push(valor);
            }
        };

        // --- Campos possíveis ---
        await tentarAdicionar("nome_completo", dadosAtualizados.nome_completo);
        await tentarAdicionar("nome_fantasia", dadosAtualizados.nome_fantasia);
        await tentarAdicionar("razao_social", dadosAtualizados.razao_social);
        await tentarAdicionar("telefone", dadosAtualizados.telefone);
        await tentarAdicionar("email", dadosAtualizados.email);

        // Atualiza senha só se realmente for enviada
        if (dadosAtualizados.senha && dadosAtualizados.senha.trim() !== "") {
            await tentarAdicionar("senha", dadosAtualizados.senha, true);
        }

        await tentarAdicionar("data_nascimento", dadosAtualizados.data_nascimento);

        // Se nada para atualizar
        if (updates.length === 0) {
            return { sucesso: false, mensagem: "Nenhum campo válido para atualizar." };
        }

        // WHERE
        values.push(cpfOuCnpj.trim());

        const sql = `UPDATE ${tabela} SET ${updates.join(", ")} WHERE ${campoId} = ?`;

        await pool.query(sql, values);

        return {
            sucesso: true,
            mensagem: "Perfil atualizado com sucesso."
        };

    } catch (err) {
        console.error("Erro ao atualizar perfil:", err);
        return {
            sucesso: false,
            mensagem: "Erro ao atualizar perfil.",
            erro: err.message
        };
    }
}

module.exports = { editarPerfil };
