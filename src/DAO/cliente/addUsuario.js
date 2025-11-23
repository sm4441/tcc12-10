const { pool } = require('../conexao');
const bcrypt = require('bcryptjs');

async function inserirCandidato(
    cpf, nome_completo, telefone, email,
    endereco, id_status, senha, limite, is_pcd = false
) {
    try {
        // 1) cadastra endereço
        const [resEndereco] = await pool.query(
            `INSERT INTO tbl_endereco_do_candidato 
             (logradouro, cep, numero, bairro, cidade)
             VALUES (?, ?, ?, ?, ?)`,

            [
                endereco.logradouro,
                endereco.cep,
                endereco.numero,
                endereco.bairro,
                endereco.cidade
            ]
        );

        const id_endereco = resEndereco.insertId;

        // 2) criptografa senha
        const senhaHash = await bcrypt.hash(senha, 10);

        // 3) cadastra candidato
        const [resCand] = await pool.query(
            `INSERT INTO tbl_candidato
            (cpf, nome_completo, telefone, email, id_endereco, id_status, senha, is_pcd, limite)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,

            [
                cpf,
                nome_completo,
                telefone,
                email,
                id_endereco,
                id_status,
                senhaHash,
                is_pcd,
                limite
            ]
        );

        return {
            sucesso: true,
            id_endereco,
            id_candidato: resCand.insertId
        };

    } catch (err) {
        return { sucesso: false, erro: err.message };
    }
}

module.exports = { inserirCandidato };
