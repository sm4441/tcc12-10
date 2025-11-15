const { conexao } = require('./conexao');
const bcrypt = require('bcryptjs');

async function editarPerfil(cpfOuCnpj, tipo, dadosAtualizados) {
    const conn = await conexao();

    try {
        let tabela = tipo === "empresa" ? "tbl_empresa" : "tbl_candidato";
        let campoId = tipo === "empresa" ? "cnpj" : "cpf";

        const updates = [];
        const values = [];

        if (dadosAtualizados.nome_completo) {
            updates.push("nome_completo = ?");
            values.push(dadosAtualizados.nome_completo);
        }
        if (dadosAtualizados.telefone) {
            updates.push("telefone = ?");
            values.push(dadosAtualizados.telefone);
        }
        if (dadosAtualizados.email) {
            updates.push("email = ?");
            values.push(dadosAtualizados.email);
        }
        if (dadosAtualizados.senha) {
            const hash = await bcrypt.hash(dadosAtualizados.senha, 10);
            updates.push("senha = ?");
            values.push(hash);
        }
        if (dadosAtualizados.data_nascimento) {
            updates.push("data_nascimento = ?");
            values.push(dadosAtualizados.data_nascimento);
        }

        if (updates.length === 0) {
            return { sucesso: false, mensagem: "Nenhum campo para atualizar." };
        }

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
